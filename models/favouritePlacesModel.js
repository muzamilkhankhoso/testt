import mongoose from "mongoose";

const favtPlacesSchema = new mongoose.Schema({
    
        driver_id:{type:mongoose.Types.ObjectId},
        name:{type:String},
        latitude : {type: String},
        longitude : {type: String},
        status:  {type: String ,default:1},
        createdDate: {type: Date,default: Date.now}

})
export default mongoose.model("favourite_places", favtPlacesSchema)


