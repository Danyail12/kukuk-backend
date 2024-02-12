import mongoose from "mongoose";
import validator from "validator";

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
        // required: [true, "Please add a price"]
    },
    image: {
        type: String,
        // required: [true, "Please add an image"]
    },
    category: {
        type: String,
        required: [true, "Please add a category"]
    },
    duration: {
        type: Number,
        // required: [true, "Please add a duration"]
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
    },
    lectures: [{
      title: {
        type: String,
        // required: [true, "Please add a title"]
      },
      description: {
        type: String,
        required: [true, "Please add a description"]
      },
      video: {
        type: String,
        // required: [true, "Please add a video"]
      },
      url:{
        type: String,
        // required: [true, "Please add a url"]
      }
    }],
    poster:{
        public_id: {
            type: String,
            // required: true
        },
        url:{
            type: String,
            // required: true
        }
    },
    views:{
        type: Number,
        default: 0
    }
})


export default mongoose.model("Course", courseSchema)