import  express from "express";
import {createReport  } from "../controllers/ReportController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/createReport").get(createReport);


export default router