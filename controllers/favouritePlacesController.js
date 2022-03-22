import Helper from "../helpers/Helper.js";
import favouritePlacesModel from "../models/favouritePlacesModel.js"
import bcrypt from 'bcrypt'


const getfavouritePlaces = async(req,res) => {


  
    try {
        let Place = await favouritePlacesModel.find({driver_id:req.body.driver_id,status:"1"}).lean();
        delete Place.password
        delete Place.token
        return res.json({result:Place})
    } catch (error) {
        return res.json({message:"Place not found"})
    }
  
}


const postfavouritePlaces = async(req,res) => {

    let cordinates_exists = await favouritePlacesModel.find({latitude:req.body.latitude,longitude:req.body.longitude}).count();
 
    if(cordinates_exists > 0){
        return res.json({message: "Cordinates already exists"})
    }

    const newRecord = {

    
        name : req.body.name,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        driver_id: req.body.driver_id
       
    }
  

    const newPlace = new favouritePlacesModel(newRecord);
    newPlace.save().then((data)=>{

       return res.json({result: data})

    }).catch(error=>{
        return res.status(400).json({message: error})
    });
  
}
const updatefavouritePlaces = async(req,res) => {

    
    const updateRecord = {
 
        name : req.body.name,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
       
    }
    
   
    favouritePlacesModel.updateOne({_id:req.body.place_id,driver_id:req.body.driver_id},{$set:updateRecord},async(error,response)=>{
        if (error) {return res.status(400).json({message:error})}
        res.json({result:response.matchedCount});
    })
  

  
}


const deleteFavouritePlace = async(req,res) => {
    
    favouritePlacesModel.updateOne({_id:req.body.place_id,driver_id:req.body.driver_id},{$set:{status : "2"}},async(error,response)=>{
        if (error) {return res.status(400).json({message:error})}
        res.json({result:(response.matchedCount ? true : false)});
    })
  
}


export default{
    getfavouritePlaces,
    postfavouritePlaces,
    updatefavouritePlaces,
    deleteFavouritePlace
  
    
 

}