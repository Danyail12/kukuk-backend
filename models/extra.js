// import mongoose from "mongoose";
// import validator from "validator";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Please add a name"]
//     },
//     firstname: {
//         type: String,
//         required: [true, "Please add a name"]
//     },
//     lastname: {
//         type: String,
//         required: [true, "Please add a name"]
//     },
//     email: {
//         type: String,
//         required: [true,"Please add an email"],
//         unique: true,
//         validate: validator.isEmail
//     },
//     password: {
//         type: String,
//         required: [true,"Please add an password"],
//         minlength: [6, "Password must be at least 6 characters"],
//         validate: validator.isStrongPassword,
//         select: false,
//     },
//     role:{
//         type: String,
//         enum: ["user", "admin","inspector"],
//         default: "user",

//     },
//     avator:{
//         type: String,
//         required: true,
//     },
//     tc: { type: Boolean, required: true }
// })


// export default mongoose.model("User", userSchema)