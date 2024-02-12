import mongoose from 'mongoose';

// Define the expert schema
const expertSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
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
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    specialization: {
      type: String,
    },
    instantReport: {
      type: Buffer,
    },
    status: {
      type: String,
      default: 'pending',
    },
    description: {
      type: String,
    },
    feesPerCunsaltation: {
      type: Number,
    },
    pocketGarrage: [
      {
        name: "String",
         email: "String",
          description: "String", 
          expires:"string", carBrand:"string", carModel:"string",year:"string",certificates:"String",
        carImages:"String"
        ,Registration:"String",InspectionCertificates:"String",
        historyString:"String",ownershipHistory:"String",invoicesBill:"String"
        ,AdditionalPhotos:"String",additionalDocuments:"String",
        createdAt: Date,
      },
    ],
  
  
    notification: {
      type: Array,
      default: [],
    },
    seenNotification: {
      type: Array,
      default: [],
    },
    timings: {
      type: Object,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    bookingsession: [
      {
        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'BookingSession',
        },
        poster: String,
      },
    ],
    reportDelivery:[
      {
        instanceReportDelivery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Report",
        },
        poster: String,
      }
    ],
    
  },
  {
    timestamps: true,
  }
);

// Add 2dsphere index on the location field
expertSchema.index({ location: '2dsphere' });

// Create and export the Expert model
export default mongoose.model('Expert', expertSchema);
