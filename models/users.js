  import mongoose from "mongoose";
  import jwt from "jsonwebtoken";
  import bcrypt from "bcrypt";

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      // required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    role:{
              type: String,
              enum: ["user", "admin"],
              default: "user",
      
          },
    pocketGarrage: [
    {
      pocketGarrage:{

        type:Object
      },
      expert:{
        type:Object
      }
      
    }
    ],
    onlineInspection: [
      {
        online: {
          type: Object
        },
        expert:{
          type:String
        }
      }
    ],
    onsiteInspection: [
      {
        onsiteInspection: {
          type:Object
        },
        expertId:{
          type:Object
        },
      } ],

    
    verified: {
      type: Boolean,
      default: false,
    },
    subscription:{
      type: Boolean,
      default: false,
    },
    subscriptionEbook:{
      type: Boolean,
      default: false,
    },
    playlist: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        poster: String,
      },
    ]
  ,

  fullbook:[
    {
      ebooks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "eBooks",
      },
      poster: String,
    
    }
  ],
  bookingsession:[
    {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingSession",

      },
      expert:{
        type:Object,
      },
      poster: String,
    }
  ],

  reportDelivery:[
    {
      instanceReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
      details:{
        type:Object,
      }
    }
  ],



  notifcation: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPasswordOtpExpiry: Date,
  });

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    });
  };
  userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
      const isMatch = await bcrypt.compare(enteredPassword, this.password);
      return isMatch;
    } catch (error) {
      return false;
    }
  };
  userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

  export const User = mongoose.model("User", userSchema);
