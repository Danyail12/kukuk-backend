import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true,"Please add an email"],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true,"Please add an password"],
        minlength: [6, "Password must be at least 6 characters"],
        validate: validator.isStrongPassword,
        select: false,
    },
    confirmPassword: {
        type:String,
        required:[true,"Please add an confirmPassword"]
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",

    },
    avator:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
        ResetPasswordToken:{
            
            type: String,
        },
        
        ResetPasswordExpire:{
            type: String,

        },
    }
})


export default mongoose.model("User", userSchema)