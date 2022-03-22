import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import User from "../models/UserModel.js";


const randomnumber = (length) =>{
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1))
}
const sendResetPasswordMail = (code,email,callback) => {
    let transportor = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWAORD
        }
    })
    let mailOption = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "code for reset password",
        text: `${code}`
    }
    return transportor.sendMail(mailOption,callback)
}
const verifyToken = (req,res,next) =>{
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ");
        req.token = bearerToken[1];
        jwt.verify(req.token,process.env.JWT_SECRET,(error,authData)=>{
            if (error) { return res.status(401).json({message:error.message}) }
            next()
        })
    } else {
        return res.status(401).json({ message: "please Insert Jwt" });
    }
}
const authorizeUser = (req, res, next) =>{
    if (req.body.tokenid == undefined || req.body.tokenid == null) {return res.status(401).json({message:"Request is not authorized"}) }
    User.findById(req.body.tokenid).exec().then(data=>{
        if (data.token !== req.token) { return res.status(401).json({message:"Request is not authorized"}) }
        else{next()}
    }).catch(error=>{return res.status(401).json({message:"Request is not authorized"})})
}
const regexSearch = (query) => {
    let search = '.*' + query + '.*';
    let value = new RegExp(["^", search, "$"].join(""), "i");
    return value;
}


 function distance(lat1, lon1, lat2, lon2, unit)  {

    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
   
}


const nearByCordinates = (poslat,poslng,range_in_meter,data) => {


    var cord =[];

    for (var i = 0; i < data.length; i++) {
      
        if (distance(poslat, poslng, data[i].latitude, data[i].longitude, "K") <= range_in_meter) {
            cord.push(data[i]._id);
        }
     
        }

        return cord;
   
}


const isoDate = (date) => {

    var datetime = date
    var start = new Date(datetime),
    dateParts = datetime.split('-'),
    y = parseInt(dateParts[0], 10),
    m = parseInt(dateParts[1], 10),
    d = parseInt(dateParts[2], 10),
    date  = start.toISOString()
    console.log(date)
    return date; // "2015-04-14T00:00:00.000Z "
    

}




export default{
    verifyToken,
    randomnumber,
    sendResetPasswordMail,
    authorizeUser,
    regexSearch,

    isoDate,
    nearByCordinates
  
}



