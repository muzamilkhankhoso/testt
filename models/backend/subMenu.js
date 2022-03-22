import mongoose from "mongoose"

const subMenuSchema = mongoose.Schema({
    
    menu_id:{type:mongoose.Types.ObjectId},
    sub_menu_name:{type:String},
    component_name :{type:String},
    created_at : { type : Date, default: Date.now }
  
});

export default mongoose.model("submenu",subMenuSchema);