import {requestCourse,contact} from "../controllers/CourseController.js";

import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";


import  express from "express";


const router = express.Router();

router.route("/requestCourse").post(requestCourse);
router.route("/contact").post(contact);

router.route("/admin/stats").get(isAuthenticated,AuthorizedAdmin,adminStats);


export default router;