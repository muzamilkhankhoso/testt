import Helper from "../helpers/Helper.js";
import DailyPlanModel from "../models/DailyPlanModel.js"
import bcrypt from 'bcrypt'


const getDailyPlan = async(req,res) => {


  
    try {
        let DailyPlan = await DailyPlanModel.find({_id:req.body._id,driver_id:req.body.driver_id,status:"1"}).lean();
        delete DailyPlan.password
        delete DailyPlan.token
        return res.json({result:DailyPlan})
    } catch (error) {
        return res.json({message:"DailyPlan not found"})
    }
  
}


const postDailyPlan = async(req,res) => {

    const newRecord = {

    
        name : req.body.name,
        detail:req.body.detail,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        driver_id: req.body.driver_id,
        time: req.body.time,
        date:  req.body.date,

       
     
       
    }
  

    const newPlace = new DailyPlanModel(newRecord);
    newPlace.save().then((data)=>{

       return res.json({result: data})

    }).catch(error=>{
        return res.status(400).json({message: error})
    });
  
}
const updateDailyPlan = async(req,res) => {
  
    const updateRecord = {
 
        name : req.body.name,
        detail:req.body.detail,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        driver_id: req.body.driver_id,
        time: req.body.time,
        date:  req.body.date,

       
    }
    
   
    DailyPlanModel.updateOne({_id:req.body._id,driver_id:req.body.driver_id},{$set:updateRecord},async(error,response)=>{
        if (error) {return res.status(400).json({message:error})}
        res.json({result:(response.matchedCount ? true : false)});
    })
  

  
}


const deleteDailyPlan = async(req,res) => {
    
    DailyPlanModel.updateOne({_id:req.body._id,driver_id:req.body.driver_id},{$set:{status : "2"}},async(error,response)=>{
        if (error) {return res.status(400).json({message:error})}
        res.json({result:(response.matchedCount ? true : false)});
    })
  
}


export default{
    getDailyPlan,
    postDailyPlan,
    updateDailyPlan,
    deleteDailyPlan
  
    
 

}