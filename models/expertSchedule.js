import mongoose from "mongoose";


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
})



export default mongoose.model("ExpertSchedule", expertScheduleSchema)