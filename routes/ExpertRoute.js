import express from "express";
import {
  createExpert,
  getExperts,
  deleteExperts,
  updateExperts,
  nearestExperts,
  getBookingSessionsForExpert
} from "../controllers/expertController.js";
import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/createExpert").post(createExpert);
router.route("/getExperts").get(getExperts);
router.route("/admin/expert/:id").put(isAuthenticated,AuthorizedAdmin ,updateExperts).delete(isAuthenticated,AuthorizedAdmin ,deleteExperts);
router.route("/nearestExperts").post(nearestExperts);
// expertRoutes.js
router.route("/admin/expert/:id/booking-sessions").get(isAuthenticated, AuthorizedAdmin, getBookingSessionsForExpert);

export default router