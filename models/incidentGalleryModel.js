import mongoose from 'mongoose';

const incidentGallerySchema = new mongoose.Schema({

    
    incident_id :{type:mongoose.Types.ObjectId}, //user
    path:{ type: String},
    created_at:{ type: Date,default: () => Date.now() }
});
export default mongoose.model('incident_gallery',incidentGallerySchema);