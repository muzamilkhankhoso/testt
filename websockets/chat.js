
import UserModel from '../models/UserModel.js';
import ChatModel from '../models/chatModel.js';
import Socket from 'socket.io';
import SimpleSchema from 'simpl-schema';
import mongoose from "mongoose";
const messageSchema = new SimpleSchema({
  senderId: String,
  receiverId: String,
  type: String,
  message: String,
  file: {
      type: Buffer,
      optional: true
  }
}).newContext();

function initChat() {
  const io = new Socket(5403, {
      cors: {
          origin: '*'
      }
  });

  io.on('connection', (socket) => {
      socket.emit('connected', 'Connected! Please subscribe to register event now!');

      socket.on('disconnection', () => {
          console.log('User disconnected');
      });

      socket.on('register', (response) => {
          if (response._id == undefined || response._id == '')
              return socket.emit("err", "Registration failed! User undefined");
          socket.join(response._id);
          return socket.emit("response", "Successfully Registered");
      });

      socket.on('offline', (response) => {
          if (response._id == undefined) return socket.emit("err", "Error! User is undefined");
          UserModel.findOne({ _id: response._id }).select('onlineStatus').then(status => {
              status.onlineStatus = 'OFFLINE';
              status.save((error, res) => {
                  if (error) return socket.emit('err', error);
                  socket.emit('offline', response);
                  io.sockets.emit('userStatus', {
                    _id: response._id,
                      onlineStatus: 'OFFLINE'
                  });
              });
          }).catch(error => { return socket.emit('err', error) });
      });

      socket.on('online', (response) => {
          if (response._id == undefined) return socket.emit("err", "Error! User is undefined");
          UserModel.findOne({ _id: response._id }).select('onlineStatus').then(status => {
              status.onlineStatus = 'ONLINE';
              status.save((error, res) => {
                  if (error) return socket.emit('err', error);
                  socket.emit('online', response);
                  io.sockets.emit('userStatus', {
                    _id: response._id,
                      onlineStatus: 'ONLINE'
                  });
              });
          }).catch(error => { return socket.emit('err', error) });
      });

      socket.on('userStatus', (response) => {
          UserModel.findOne({ _id: response._id }).select('onlineStatus').then(status => {
              socket.emit('userStatus', status);
          }).catch(error => { return socket.emit('err', error) });
      });

    //   socket.on('findFriends', async (response) => {
    //       if (response.phone == undefined) return socket.emit("err", "Error! Phone Number is undefined");
    //       let friend = await UserModel.findOne({ phone: response.phone }).select('fullName username profilePic onlineStatus').lean();
    //       if (!friend) return socket.emit('err', `Error! No user found with phone number ${response.phone}`);
    //       return socket.emit('friend', friend);
    //   });

      socket.on("chatList", async (response) => {
          let list = await UserModel.findOne({ _id: response._id }).select("chatFriends").lean();
          if (list.chatFriends == undefined) return socket.emit("chatList", []);
          let userlist = await Promise.all(list.chatFriends.map(async (list) => {
              return {
                  user: await UserModel.findOne({ _id: response._id }).select("name phone email"),
                  chat: list.chat
              }
          }));
          socket.emit('chatList', userlist);
      });

      socket.on('chatMessages', async (response) => {
          const sender = UserModel.findOne({ _id: response.senderId });
          const receiver = UserModel.findOne({ _id: response.receiverId });
          if (!sender) return socket.emit('err', `Error! No user found  ${response.senderId}`);
          if (!receiver) return socket.emit('err', `Error! No user found  ${response.receiverId}`);
          const chats = await ChatModel.find({
              $or: [
                  { senderId: response.senderId, receiverId: response.receiverId }, { senderId: response.receiverId, receiverId: response.senderId }
              ]
          }).sort({ createdDate: 1 });
          return socket.emit('chatMessages', chats);
      });

      socket.on('message', async (response) => {
          if (response.type == 'file' && response.file !== undefined) {
              response.file = Buffer.from(response.file, "base64");
          }
          const isValid = messageSchema.validate(response);
          if (!isValid) return socket.emit('err', `Error! Message does not satisfy the schema`);
          if (response.senderId == response.receiverId) return socket.emit('err', `Error! sender can't be the receiver`);
          const sender = await UserModel.findOne({ _id: response.senderId }).lean();
          const receiver = await UserModel.findOne({ _id: response.receiverId }).lean();
          if (!sender) return socket.emit('err', `The sender'account doesn't exists`);
          if (!receiver) return socket.emit('err', `The receiver's account  doesn't exists`);

          if (response.type == "file") {
              response.message = `${uuidv4()}.${response.message.split('.')[1]}`;
              fs.writeFileSync(`public/uploads/chats/${response.message}`, response.file);
              delete response.file;
              response.message = `https://${process.env.DOMAIN}/uploads/chats/${response.message}`;
          }

          UserModel.findOne({ _id: response.senderId }).exec(function (err, array) {
              let findSenderChatList = array.chatFriends.findIndex(x => x.user_id == response.receiverId)
              if (findSenderChatList == -1) {
                  array.chatFriends.push({
                    user_id: mongoose.Types.ObjectId(response.receiverId),
                      chat: response.message,
                      dateTime : new Date().toISOString()
                  });
              } else {
                  array.chatFriends[findSenderChatList] = {
                    user_id: mongoose.Types.ObjectId(response.receiverId),
                      chat: response.message,
                      dateTime :new Date().toISOString()
                  }
              }
              array.save(function (err) {
                  if (err) socket.emit('err', "Something went worng");
              });
          });

          UserModel.findOne({ _id: response.receiverId }).exec(function (err, array) {
              let findSenderChatList = array.chatFriends.findIndex(x => x.user_id == response.senderId)
              if (findSenderChatList == -1) {
                  array.chatFriends.push({
                      user_id: mongoose.Types.ObjectId(response.senderId),
                      chat: response.message,
                      dateTime :new Date().toISOString()
                  });
              } else {
                  array.chatFriends[findSenderChatList] = {
                    user_id: mongoose.Types.ObjectId(response.senderId),
                      chat: response.message,
                      dateTime :new Date().toISOString()
                  }
              }
              array.save(function (err) {
                  if (err) socket.emit('err', "Something went worng");
              });
          });

          await new ChatModel(response).save().then((message) => {
              socket.to(response.receiverId).emit('message', response.message);
              socket.emit('message', response.message);
          }).catch(err => socket.emit('err', err.message));
      });
  });
}

export default { initChat };
