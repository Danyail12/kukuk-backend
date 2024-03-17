import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      default: 'Active',
    },
    description: {
      type: String,
    },
    feesPerConsaltation: {
      type: String,
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
    onlineInspection: [
      {
        make: "String",
        model: "String",
        year: "String", 
        vechicleVin:"string", 
        body:"string", 
        licensePlates:"string",
        handTruck:"string",
        glass:"String",
        wiperBlades:"String"
        ,Reflectors:"String",
        mudFlaps:"String",
        racking:"String",
        coldCurtains:"String",
        doorIssues:"String"
        ,insurance:"String",
        headlights:"String",
        turnsignals:"String",
        makerlights:"String",
        brakeLights:"String",
        carImages:"String",
        RegistrationImages:"String",
        Documents:"String",
        location: {
          type: {
            type: String,
            default: 'Point',
          },
          coordinates: {
            type: [Number],
            default: [0, 0],

          }
        },
        createdAt: Date,
        userId:"String",
      },
    ],
    onsiteInspection: [
      {
        make: "String",
        model: "String",
        year: "String", 
        vechicleVin:"string", 
        body:"string", 
        licensePlates:"string",
        handTruck:"string",
        glass:"String",
        wiperBlades:"String"
        ,Reflectors:"String",
        mudFlaps:"String",
        racking:"String",
        coldCurtains:"String",
        doorIssues:"String"
        ,insurance:"String",
        headlights:"String",
        turnsignals:"String",
        makerlights:"String",
        brakeLights:"String",
        carImages:"String",
        RegistrationImages:"String",
        Documents:"String",
        createdAt: Date,
        userId:"String",
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
    blocked: {
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
    
    expertSchedule: [
      {
        name: "String",
        email: "String",
        description: "String",
        specailization:"String",
        date:"String",
        city: "String",
        country:"String",
        timing:"String",
        reserved: {
          type: Boolean,
          default: false
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
          expertId: "String",
          _id: "String",
        }
      }
    ]
    ,
    reportDelivery:[
      {
        instanceReportDelivery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Report",
        },
        poster: String,
      }
    ],
    
    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
  },
  {
    timestamps: true,
  }
);

expertSchema.index({ location: '2dsphere' });




expertSchema.pre("save", async function (next) {
  if (!this.isModified("password")) 
  {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
expertSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (error) {
    return false;
  }
}

expertSchema.methods.getJWTToken = function () {
  const token =  jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });
  return token;
};
export default mongoose.model('Expert', expertSchema);
