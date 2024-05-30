import mongoose from "mongoose";


const reportSchema = new mongoose.Schema({
    
    damage: {
        type: String,
        // required: true
    },
    description:{
        type: String,
        // required: true
    },
    image:{
        public_id: {
            type: String,
            // required: true
        },
        url:{
            type: String,
            // required: true
        }
    },
    expires:{
        type: Date,
        // required: true
    },
    onsiteId:{
        type: String,
    }
})

export default mongoose.model("Report", reportSchema)