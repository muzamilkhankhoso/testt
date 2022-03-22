import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({

    
    general :{ type: Object}, 
    sound_voice:{ type: Object},
    privacy_setting:{ type: Object},
    notifications:{ type: String},
    updates:{ type: String},
   
});
export default mongoose.model('settings',settingSchema);