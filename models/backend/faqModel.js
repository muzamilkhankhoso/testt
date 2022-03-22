import mongoose from "mongoose"

const faqSchema = mongoose.Schema({
    question:{type:String},
    answer:{type:String},
    created_at : { type : Date, default: Date.now }
});

export default mongoose.model("faq",faqSchema);