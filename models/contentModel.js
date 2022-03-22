import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
        welcome:{type:String},
        walkthrough : {type: String},
        createdDate: {type: Date,default: Date.now
    }

})
export default mongoose.model("content", contentSchema)


