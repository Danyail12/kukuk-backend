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
  ScheduleBooking,
  getExpertSchedule,
  deleteExpertSchedule,
  blockExpert,
  unblockExpert,
  availableBookings,
  // rescheduleBooking,
  RescheduleBooking,
  NotReservedExpert,
  getExpertPockets,
  getExpertOnlineInspections,
  getExpertOnsiteInspections,
  addReport,
  getReport,
  getExpertsAppointment,
  getNotification,
  getReportForExpert
} from "../controllers/expertController.js";
import { AuthorizedAdmin, isAuthenticated, AuthotrizedExpert } from "../middlewares/auth.js";

const router = express.Router();

router.route("/admin/createExpert").post(createExpert);
router.route("/getExperts").get(getExperts);
router.route("/admin/expert/:id").put( updateExperts).delete(deleteExperts);
router.route("/nearestExperts").post(nearestExperts);
router.route("/admin/expert/:id/booking-sessions").get(getBookingSessionsForExpert);
router.route("/expert/booking-sessions").get(AuthotrizedExpert,getExpertBookingSessions);
// router.route("/expert/register").post(register)
router.route("/expert/login").post(login)
router.route("/expert/logout").get(logout)
// router.route("/expert/verify").post(AuthotrizedExpert,verify)
router.route("/expert/scheduleBooking").post(isAuthenticated,AuthotrizedExpert, ScheduleBooking)
router.route("/expert/getSchedule").get(isAuthenticated,AuthotrizedExpert, getExpertSchedule)
router.route("/expert/deleteSchedule/:id").delete(isAuthenticated,AuthotrizedExpert, deleteExpertSchedule)
router.route("/expert/active/:id").put( blockExpert)
router.route("/expert/Unactived/:id").put( unblockExpert)
router.route("/expert/availableBookings").post(isAuthenticated,availableBookings)
router.route("/RescheduleBooking/:id").put(isAuthenticated,RescheduleBooking)
router.route("/NotReservedExpert").get(NotReservedExpert)
router.route("/getExpertPockets").get(isAuthenticated,AuthotrizedExpert,getExpertPockets)
router.route("/getExpertOnlineInspections").get(isAuthenticated,AuthotrizedExpert,getExpertOnlineInspections)
router.route("/getExpertOnsiteInspections").get(isAuthenticated,AuthotrizedExpert,getExpertOnsiteInspections)
// router.route("/getExpertSchedule").get(isAuthenticated,AuthotrizedExpert,getExpertSchedule)
router.route("/expert/deleteSchedule/:id").delete(isAuthenticated,AuthotrizedExpert, deleteExpertSchedule)
router.route("/expert/addReport").post(isAuthenticated,AuthotrizedExpert, addReport)
router.route("/expert/getReport").get(isAuthenticated,AuthotrizedExpert, getReport)
router.route("/getExpertsAppointment").get(isAuthenticated,AuthotrizedExpert, getExpertsAppointment)
router.route("/getNotification").get(isAuthenticated,AuthotrizedExpert, getNotification)
router.route("/expert/getReportForExpert").get(isAuthenticated,AuthotrizedExpert, getReportForExpert)
export default router;