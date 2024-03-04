import  express from "express";
import { createCourse, getCourse , getCourseLectures, addLecture,deleteCourse } from "../controllers/CourseController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.route("/course").get(getCourse);
router.route("/createcourse").post(createCourse);
router.route("/course/:id").get(AuthorizedSubscriber,getCourseLectures).post(addLecture);
router.route("/deleteCourse/:id").delete(deleteCourse);

export default router;