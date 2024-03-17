import  express from "express";
import {createReport,deleteReport,updateReport  } from "../controllers/ReportController.js";
import { AuthorizedAdmin, AuthotrizedExpert, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/createReport").get(isAuthenticated,AuthotrizedExpert,createReport);
router.route("/deleteReport/:id").delete(isAuthenticated,AuthotrizedExpert,deleteReport);
router.route("/updateReport/:id").put(isAuthenticated,AuthotrizedExpert,updateReport);


export default router