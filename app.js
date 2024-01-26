import express from "express";
import User from "./routes/userRoute.js";
import Courses from "./routes/CourseRoute.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config({
    path: "./config/config.env",
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())
app.use("/api/v1", User);
app.use("/api/v1", Courses);

app.get("/", (req, res) => {
  res.send("Server is working");
});


export default app;