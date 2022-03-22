import mongoose from 'mongoose';

const dailPlanSchema = new mongoose.Schema({

    
    driver_id :{type:mongoose.Types.ObjectId}, //user
    name:{ type: String},
    detail:{ type: String},
    time:{ type: String},
    date:{ type: String},
    latitude:{ type: String},
    longitude :{type: String},
    status:{type:String,  default: 1},
    created_at:{ type: Date,default: () => Date.now() }
});
export default mongoose.model('daily_plans',dailPlanSchema);