import  express from "express";
import { createCourse, getCourse } from "../controllers/CourseController.js";


const router = express.Router();

router.route("/course").get(getCourse);
router.route("/createcourse").post(createCourse);

export default router;