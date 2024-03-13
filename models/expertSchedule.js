import mongoose from "mongoose";
import  Expert  from "../models/expert.js";
import { User } from "../models/users.js";

const expertScheduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description:{
        type: String,
        // required: true
    },
    specailization:{
        type: String,
    },
    date:{
        type: Date,
        // required: true
    },
    time:{
        type: String,
        // required: true
    },
    location: {
        type: {
          type: String,
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
      feesPerConsaltation: {
        type: Number,
      },
      bookedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      ],
      reserved:{
        type:Boolean,
        default:false,
      },
      createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Expert"
      }
})



export default mongoose.model("ExpertSchedule", expertScheduleSchema)