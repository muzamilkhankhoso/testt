import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({

    
    first_name:{ type: String,required: true},
    last_name:{ type: String,required: true},
    username:{ type: String},
    token: {type: String},
    user_type:{ type:String},
    phone:{ type: Number},
    email: {type: String,unique: true,required: true},
    password: {type: String,required: true},
    profile_image: { type: String},
    about:{type: String},
    dateofbirth: {type: Date},
    age: {type: Number},
    zipcode:{type: String},
    location_name:{type: String},
    latitude:{ type: String},
    longitude:{type: String},
    city:{type: String},
    state:{ype: String},
    country:{type: String},
    visibility:{type: String},
    sound:{type: String},
    alerts:{type: String},
    status:{type:String,  default: 1},
    onlineStatus: {
        type: String,
        default: "OFFLINE"
      },
      chatFriends: {
        type: Array,
        default: []
      },
  
    created_at:{
        type: Date,
        default: () => Date.now()
    }
});
export default mongoose.model('User',usersSchema);