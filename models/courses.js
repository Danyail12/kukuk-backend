import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        minlength: [4, "Name must be at least 4 characters"],
        maxlength: [50, "Name must be less than 50 characters"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    price: {
        type: Number,
        required: [true, "Please add a price"]
    },
    image: {
        type: String,
        required: [true, "Please add an image"]
    },
    category: {
        type: String,
        required: [true, "Please add a category"]
    },
    duration: {
        type: Number,
        required: [true, "Please add a duration"]
    },
    createdBy: {
        type:String
    },
    stars: {
        type: Number,
        default: 0
    },
    numOfVideos: {
        type: Number,
        default: 0
    }
})


export default mongoose.model("Course", courseSchema)