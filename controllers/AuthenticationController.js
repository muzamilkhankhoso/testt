import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js';
import Helper from "../helpers/Helper.js"

const register = async(req,res) =>{
    let { first_name, last_name, user_type, phone, email, password } = req.body;
    if (!user_type) {return res.status(400).json({message:"Must b select User type"})}
    if (!first_name || !last_name || !phone || !email || !password) {return res.status(400).json({message:"All Fields required"})}
    req.body.password = await bcrypt.hash(password,10);
    User.findOne({email:email}).exec((error,result)=>{
        if (error) {return res.status(400).json({message:error.message})} 
        if (result) {return res.status(400).json({message:"Email already exist"})}
        else{
            User.create(req.body).then(result =>{
                result.password = "";
                const token = jwt.sign({_id:result._id,name:result.first_name},process.env.JWT_SECRET)
                User.updateOne({_id:result._id},{$set:{token:token}},async(error,response)=>{
                    if (error) {return res.status(400).json({message:error.message})}
                    res.json({result:await User.findById(result._id).exec()});
                })
            }).catch(error => {return res.status(400).json({message:error.message})})
        }
    })
}

const login = (req,res) =>{
    let {email, password} = req.body
    if (!email || !password) {return res.status(400).json({message:"fields are required"})}

    User.findOne({email:email,status:1},async(error,result)=>{


        if (error) {return res.status(400).json({message:error.message})}
        if (!result) {return res.status(400).json({message:"Invalid Email & Password"})}


        else{
          
            let passwordCheck = await bcrypt.compare(password,result.password)
                
            if (!passwordCheck) {return res.status(400).json({message:"Invalid Email & Password"})}

            else{
                const token = jwt.sign({_id:result._id,name:result.first_name},process.env.JWT_SECRET)

                User.findOneAndUpdate({_id:result._id},{$set:{token:token}},async(error,result)=>{

                    if (error) {return res.status(400).json({message:error.message})}

                    result.password = ""
                    result.token = token
                    
                    res.json({result});
                })
            }
        }

    })
}

const resetpassword = (req,res) => {
    let {email} = req.body
    if (!email) {return res.status(400).json({message:"Email are required"})}
    User.findOne({email:email},async(error,result) => {
        if (error) {return res.status(400).json({message:error.message})}
        if (!result) {return res.status(400).json({message:"Invalid Email"})}
        else{
            let code = Helper.randomnumber(6);
            Helper.sendResetPasswordMail(code , result.email,(error,response) => {
                if (error) {return res.status(400).json({message:error.message})}
                result = {
                    _id: result._id,
                    email:result.email,
                    code: code
                }
                return res.json({result})
            });
        }
    })
}

export default {
    register,
    login,
    resetpassword,
}