import Helper from "../helpers/Helper.js";
import mongoose from "mongoose"
import contentModel from "../models/contentModel.js";




const UpdateWelcomeContent = async(req,res) => {



  contentModel.updateOne({_id:'623062c42f1701778b0f79e3'},{$set:{welcome : req.body.welcome}},async(error,response)=>{

      if (error) {return res.status(400).json({result:false})}
      res.json({result:await contentModel.find()});
    })



}

const getWelcomeContent = async(req,res) => {



    try {
      let welcome = await contentModel.findOne({_id:'623062c42f1701778b0f79e3'}).lean();
      delete welcome.password
      delete welcome.token
      return res.json({result:welcome})
    } catch (error) {
        return res.json({result:"user not found"})
    }
  
  
}

const UpdateWalkthroughContent = async(req,res) => {



  contentModel.updateOne({_id:'623062c42f1701778b0f79e3'},{$set:{walkthrough : req.body.walkthrough}},async(error,response)=>{

      if (error) {return res.status(400).json({result:false})}
      res.json({result:await contentModel.find()});
    })



}

const getWalkthroughContent = async(req,res) => {



    try {
      let welcome = await contentModel.findOne({_id:'623062c42f1701778b0f79e3'}).lean();
      delete welcome.password
      delete welcome.token
      return res.json({result:welcome})
    } catch (error) {
        return res.json({result:"user not found"})
    }
  
  
}






  





export default{
  UpdateWelcomeContent,
  getWelcomeContent,
  UpdateWalkthroughContent,
  getWalkthroughContent


 
}