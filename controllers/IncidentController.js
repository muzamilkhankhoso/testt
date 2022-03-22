
import User from '../models/UserModel.js';
import Helper from "../helpers/Helper.js"
import IncidentModel from '../models/IncidentModel.js';
import incidentGalleryModel from '../models/incidentGalleryModel.js';
import UserModel from '../models/UserModel.js';
import mongoose from "mongoose"


const postIncident = async(req,res) =>{




    let cordinates_exists = await IncidentModel.find({latitude:req.body.latitude,longitude:req.body.longitude}).count();
 
    if(cordinates_exists > 0){
        return res.json({message: "Cordinates already exists"})
    }


    let driver_exists = await UserModel.find({_id:req.body.driver_id}).count();

    if(driver_exists === 0){
        return res.json({message: "user doesnt exists"})
    }


     let file = req.files
    
     if(file != null && file.incident_gallery != undefined && file.incident_gallery != null){

        //multi upload
       if((file.incident_gallery).length > 1){
           
        var gallery = [];
        let fileArr =  file.incident_gallery;
        fileArr.forEach(file => {
            let fileName = `public/uploads/incidentGallery/${Date.now()}-${file.name.replace(/ /g, '-').toLowerCase()}`;
            file.mv(fileName,(error)=>{
                if (error) { return res.status(400).json({status: "400", result: error.message})}
            });
            fileName = fileName.replace("public", "");
            gallery.push(fileName)
        });
      

       }else{


      //single upload
        let file2 = req.files
        file2 = file2.incident_gallery
       
        if (true) {
            var gallery = [];
            let fileName = `public/uploads/incidentGallery/${Date.now()}-${file2.name.replace(/ /g, '-').toLowerCase()}`;
            file2.mv(fileName,(error)=>{
                if (error) { return res.status(400).json({message: error.message})}
            })
            fileName = fileName.replace("public", "");
            gallery.push(fileName)
       
        }else {
            return res.status(400).json({message: "File type must b image.."})
        }

       }
       
       
       

}

        const newRecord = {

    
            driver_id : req.body.driver_id,
            incident:req.body.incident,
            incident_type:req.body.incident_type,
            comment :req.body.comment,
            latitude :req.body.latitude,
            longitude :req.body.longitude,
            icon :req.body.icon,

        }
        console.log(gallery)

        const newIncident = new IncidentModel(newRecord);
        newIncident.save().then((data)=>{
        res.json({result: data})
        
        
        gallery.forEach(galleryData => {
            const newIncidentGallery = new incidentGalleryModel({path:galleryData,incident_id:data.id});
            newIncidentGallery.save()
        });

        }).catch(error=>{
        return res.status(400).json({message: error})
        });


  
}


const getIncidents = async(req,res) => {

    try {
       

        let incident = await IncidentModel.aggregate([

            { $match : { status : "1" }}  ,
            {  $lookup:
                {
                  from: "incident_galleries",
                  localField: "_id",
                  foreignField: "incident_id",
                  as: "incident_gallery"
                }
             },

             {  $lookup:
                {
                  from: "users",
                  localField: "driver_id",
                  foreignField: "_id",
                  as: "driverDetail"
                }
             },
             
         

           
          ])
         
        delete incident.password
        delete incident.token
        return res.json({result:incident})
    } catch (error) {
        return res.json({result:"incident not found"})
    }
  
}


const updateIncident = async(req,res) => {



    let file = req.files
    
    if(file != null && file.incident_gallery != undefined && file.incident_gallery != null){

       //multi upload
      if((file.incident_gallery).length > 1){
          
       var gallery = [];
       let fileArr =  file.incident_gallery;
       fileArr.forEach(file => {
           let fileName = `public/uploads/incidentGallery/${Date.now()}-${file.name.replace(/ /g, '-').toLowerCase()}`;
           file.mv(fileName,(error)=>{
               if (error) { return res.status(400).json({status: "400", result: error.message})}
           });
           fileName = fileName.replace("public", "");
           gallery.push(fileName)
       });
     

      }else{


     //single upload
       let file2 = req.files
       file2 = file2.incident_gallery
      
       if (true) {
           var gallery = [];
           let fileName = `public/uploads/incidentGallery/${Date.now()}-${file2.name.replace(/ /g, '-').toLowerCase()}`;
           file2.mv(fileName,(error)=>{
               if (error) { return res.status(400).json({message: error.message})}
           })
           fileName = fileName.replace("public", "");
           gallery.push(fileName)
      
       }else {
           return res.status(400).json({message: "File type must b image.."})
       }

      }

}
    

    const newRecord = {

    
        driver_id : req.body.driver_id,
        incident:req.body.incident,
        incident_type:req.body.incident_type,
        comment :req.body.comment,
        latitude :req.body.latitude,
        longitude :req.body.longitude,
        icon :req.body.icon,

    }

    IncidentModel.updateOne({_id:req.body.incident_id},{$set:newRecord},async(error,response)=>{
        
        if (error) {return res.status(400).json({message:error.message})}
  
        if(gallery.length !== 0 ){
      
  
          gallery.forEach(galleryData => {
            const newIncidentGallery = new incidentGalleryModel({path:galleryData,incident_id:req.body.incident_id});
            newIncidentGallery.save()
        });
  
  
        }
  
        let incident = await IncidentModel.aggregate([

            { $match: { _id:mongoose.Types.ObjectId(req.body.incident_id)} },
            {  $lookup:
                {
                  from: "incident_galleries",
                  localField: "_id",
                  foreignField: "incident_id",
                  as: "incident_gallery"
                }
             },

             {  $lookup:
                {
                  from: "users",
                  localField: "driver_id",
                  foreignField: "_id",
                  as: "driverDetail"
                }
             },
             
         

           
          ])
         
      
        return res.json({result:incident})
  
      
  
    })


}


const deleteIncident = async(req,res) => {



    IncidentModel.updateOne({_id:req.body.incident_id},{$set:{status:"2"}},async(error,response)=>{
        if (error) {return res.status(400).json({message:error.message})}
        res.json({result:(response.matchedCount ? true : false)});
    })


}


export default {
    postIncident,
    getIncidents,
    deleteIncident,
    updateIncident

}