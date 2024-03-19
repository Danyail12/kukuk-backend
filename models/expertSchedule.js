import mongoose from "mongoose";
import  expert  from "../models/expert.js";
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
   timing: {
      start: String, // Or you can store times as strings if you prefer
      end: String,   // Or you can use Date objects for timings as well
    },
    city:{
        type: String,
    },
    country:{
        type: String,
    },
    category:{
      enum: ['bookingSession', 'onlineInspection', 'onsiteInspection'],
    }
,
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
        ref:"expert"
      },
      feesPerConsaltation: {
        type: Number,
      }
})



export default mongoose.model("ExpertSchedule", expertScheduleSchema)