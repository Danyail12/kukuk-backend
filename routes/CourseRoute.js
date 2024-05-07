import  express from "express";
import { createCourse, getCourse , getCourseLectures, addLecture,deleteCourse,fileUpload,upload_aws} from "../controllers/CourseController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";
import multer from 'multer';
import upload from "../utils/aws_serverice.js";
import aws from 'aws-sdk';

// const upload = multer();

const router = express.Router();
router.route("/upload").post(upload.single('file'), fileUpload);
router.route("/upload_aws").post(upload.single('file'),upload_aws);
router.route("/course").get(getCourse);
router.route("/createcourse").post(createCourse);
router.route("/course/:id").get(AuthorizedSubscriber,getCourseLectures).post(addLecture);
router.route("/deleteCourse/:id").delete(deleteCourse);

export default router;