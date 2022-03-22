import mongoose from "mongoose"

const mainMenuSchema = mongoose.Schema({
    menu_name:{type:String},
    menu_type:{type:String},
    order : { type : Number, default: 0 },
    created_at : { type : Date, default: Date.now }
  
});

export default mongoose.model("mainmenu",mainMenuSchema);