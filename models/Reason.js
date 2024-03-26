import mongoose from "mongoose";


const reasonSchema = new mongoose.Schema({
    reasonList : {
        type: String,
        enum:["Borem ipsum dolor sit amet consec?", "Qorem ipsum dolor sit amet consec?", "Rorem ipsum dolor sit amet","Other"],
        default: "Other",
        required: true
    }
})


export default mongoose.model("Reason", reasonSchema)