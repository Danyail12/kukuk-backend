import express from "express";
import {
  createExpert,
  getExperts,
  deleteExperts,
  updateExperts,
  nearestExperts,
  getBookingSessionsForExpert,
  getExpertBookingSessions,
  login,
  logout,
  verify,
  ScheduleBooking,
  getExpertSchedule,
  deleteExpertSchedule,
  blockExpert,
  unblockExpert
} from "../controllers/expertController.js";
import { AuthorizedAdmin, isAuthenticated, AuthotrizedExpert } from "../middlewares/auth.js";

const router = express.Router();

router.route("/admin/createExpert").post(createExpert);
router.route("/getExperts").get(getExperts);
router.route("/admin/expert/:id").put( updateExperts).delete(deleteExperts);
router.route("/nearestExperts").post(nearestExperts);
// expertRoutes.js
router.route("/admin/expert/:id/booking-sessions").get(getBookingSessionsForExpert);
router.route("/expert/booking-sessions").get(AuthotrizedExpert,getExpertBookingSessions);
router.route("/expert/login").post(login)
router.route("/expert/logout").get(logout)
router.route("/expert/verify").post(AuthotrizedExpert,verify)
router.route("/expert/scheduleBooking").post(isAuthenticated,AuthotrizedExpert, ScheduleBooking)
router.route("/expert/getSchedule").get(isAuthenticated,AuthotrizedExpert, getExpertSchedule)
router.route("/expert/deleteSchedule/:id").delete(isAuthenticated,AuthotrizedExpert, deleteExpertSchedule)
router.route("/expert/active/:id").put( blockExpert)
router.route("/expert/Unactived/:id").put( unblockExpert)

export default router