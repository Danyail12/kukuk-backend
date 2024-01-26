import  express from "express";
import { createCourse, getCourse , getCourseLectures, addLecture } from "../controllers/CourseController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.route("/course").get(getCourse);
router.route("/createcourse").post(isAuthenticated,AuthorizedAdmin ,createCourse);
router.route("/course/:id").get(AuthorizedSubscriber,getCourseLectures).post(isAuthenticated,AuthorizedAdmin , addLecture);


export default router;