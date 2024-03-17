// Import necessary modules and mongoose
import mongoose from 'mongoose';

// Define the bookingSession schema
const bookingSessionSchema = new mongoose.Schema({

    ownership: {
      type: String,
    },
    durationofownership: {
      type: String,
    },
    notableFeatures: {
      type: String,
    },
    purpose: {
      type: String,
    },
    additionalDetails: {
      type: String,
    },
    question1: {
      enum: ["Yes", "No", "i am about to get in touch", "others"],
      type: String,
      default: "No",
    },
    question2: {
      enum: ["Yes", "No"],
      type: String,
      default: "No",
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    make: {
      type: String,
    },
    model: {
      type: String,
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
    year: {
      type: String,
    },
    vehicleVin: {
      type: String,
    },
    sessionDescription: {
      type: String,
    },
    currentVehicleDescription: {
      type: String,
    },
    linkToAdvertisement: {
      type: String,
    },
} 

)

// Define and export the BookingSession model
const BookingSession = mongoose.model('BookingSession', bookingSessionSchema);
export default BookingSession;
