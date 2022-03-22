


import Helper from "../helpers/Helper.js";
import UserModel from "../models/UserModel.js"
import bcrypt from 'bcrypt'
import settingModel from "../models/settingModel.js"

const getProfile = async(req,res) => {

    try {
        let user = await UserModel.findOne({_id:req.body.user_id}).lean();
        delete user.password
        delete user.token
        return res.json({result:user})
    } catch (error) {
        return res.json({message:"user not found"})
    }
  
}
const updateProfile = async(req,res) => {


 
    if(req.body.authData._id !== req.body.user_id){
        return res.status(400).json({message:"Token not matched"})
    }

   let emails = await UserModel.find().distinct('email');
   let emails_user = await UserModel.find({_id:req.body.user_id},{email:1,_id:0});
   let email_arr = emails.filter(function(item) { return item !== emails_user[0].email})
   
   if(email_arr.includes(req.body.email)){

    return res.status(400).json({message:"email already exist"})

   }
    

   let updateRecord = {}
 
   //profile image
   let file3 = req.files
    if(file3 != null && file3.profile_image != undefined && file3.profile_image != null)
    {
  
        file3 = file3.profile_image
       
        if (true) {
            var profile_image_path = `public/uploads/profilePictures/${Date.now()}-${file3.name.replace(/ /g, '-').toLowerCase()}`;
            file3.mv(profile_image_path,(error)=>{
                if (error) { return res.status(400).json({result: error.message})}
            })
            profile_image_path = profile_image_path.replace("public", "");
         
            updateRecord.profile_image = profile_image_path
        }else {
            return res.status(400).json({result: "File type must b image.."})
        }

       
    }
    if( req.body.password !== undefined){
        const pass =  await bcrypt.hash(req.body.password,10);
        updateRecord.password=pass
    }

    updateRecord.first_name = req.body.first_name,
    updateRecord.last_name = req.body.last_name,
    updateRecord.visibility = req.body.visibility,
    updateRecord.phone = req.body.phone,
    updateRecord.email = req.body.email,
    updateRecord.sound = req.body.sound,
    updateRecord.alerts = req.body.alerts,
  
    
   
    UserModel.updateOne({_id:req.body.user_id},{$set:updateRecord},async(error,response)=>{
        if (error) {return res.status(400).json({message:error})}
        res.json({result:await UserModel.findById(req.body.user_id).exec()});
    })
  

  
}

const updateUserPassword = async(req,res) => {

    let newPassword = await bcrypt.hash(req.body.password,10);
    UserModel.updateOne({_id:req.body.user_id},{$set:{

        password :newPassword
      
    }}).then((data)=>{
        res.json({result: true})
    }).catch(error=>{
        return res.status(400).json({result: false})
    });

}



const updateSetting = async(req,res) => {

    settingModel.updateOne({_id:"623963d785a39f74f560ddc1"},{$set:{

        general :req.body.general,
        sound_voice :req.body.sound_voice,
        privacy_setting :req.body.privacy_setting,
        notifications :req.body.notifications,
        updates :req.body.updates,
      
    }}).then((data)=>{
        res.json({result: true})
    }).catch(error=>{
        return res.status(400).json({result: error})
    });

}


const getSettings = async(req,res) => {

  
    try {
        let settings = await settingModel.findOne({_id:"623963d785a39f74f560ddc1"}).lean();
        delete settings.password
        delete settings.token
        return res.json({result:settings})
    } catch (error) {
        return res.json({message:"setting not found"})
    }
}





export default{
    getProfile,
    updateProfile,
    updateUserPassword,
    updateSetting,
    getSettings
  
    
 

}