import mongoose from "mongoose"

const termsConditionSchema = mongoose.Schema({
    _id: {type:mongoose.Types.ObjectId , default: "61dfec2be92cf8019dc097dc" },
    terms_condition:{type:String},
    created_at : { type : Date, default: Date.now }
});

export default mongoose.model("terms_condition",termsConditionSchema);