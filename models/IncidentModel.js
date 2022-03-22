import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({

    
    driver_id :{type:mongoose.Types.ObjectId}, //user
    incident:{ type: String},
    icon:{ type: String},
    incident_type:{ type: String},
    comment :{type: String},
    latitude :{type: String},
    longitude :{type: String},
    status:{type:String,  default: 1},
    created_at:{ type: Date,default: () => Date.now() }
});
export default mongoose.model('incident',incidentSchema);