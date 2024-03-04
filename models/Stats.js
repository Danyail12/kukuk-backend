
import mongoose from "mongoose"


const statsSchema = new mongoose.Schema({
    user: {
        type: Number,
        default: 0
    },
    subscription: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Date,
        default: Date.now

    }
    
})




export default mongoose.model('Stats', statsSchema)



