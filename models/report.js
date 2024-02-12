import mongoose from "mongoose";


const reportSchema = new mongoose.Schema({
    
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    description:{
        type: String,
        // required: true
    },
    expires:{
        type: Date,
        // required: true
    }
})

export default mongoose.model("Report", reportSchema)