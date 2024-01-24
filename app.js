import  express  from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
// import ErrorMiddleware from "./middlewares/Error.js";
import Course from "./models/Course.js";
import User from "./models/user.js";

dotenv.config({
    path: "./config/config.env"
});
const app = express();
app.use(bodyParser.json());
app.use("api/v1",Course)
app.use("api/v1",userRegistration)
app.use("api/v1",userLogin)
app.use('api/users/',forgetPassword)
export default app;

// app.use(ErrorMiddleware);