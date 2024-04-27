import  express from "express";
import { createCourse, getCourse , getCourseLectures, addLecture,deleteCourse, upload_aws } from "../controllers/CourseController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.route("/uploadFile").post(upload_aws);
router.route("/course").get(getCourse);
router.route("/createcourse").post(createCourse);
router.route("/course/:id").get(AuthorizedSubscriber,getCourseLectures).post(addLecture);
router.route("/deleteCourse/:id").delete(deleteCourse);

export default router;