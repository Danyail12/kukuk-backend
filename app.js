import  express  from "express";
import bodyParser from "body-parser";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
// import Course from "./models/Course.js";
import User from "./models/user.js";
import userRegistration from "./routes/userRegistration.js";
import userLogin from "./routes/userLogin.js";
import forgetPassword from "./routes/forgetPassword.js";
import getCourse from "./routes/CourseRoute.js";
import createCourse from "./routes/CourseController.js";

dotenv.config({
    path: "./config/config.env"
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("api/v1",getCourse)
app.use("api/v1",createCourse)
app.use("api/v1",userRegistration)
app.use("api/v1",userLogin)
app.use('api/users/',forgetPassword)
export default app;

// app.use(ErrorMiddleware);