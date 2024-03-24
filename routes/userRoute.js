import express from "express";
import {
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
  verify,
  addtoplaylist,
  removetoplaylist,
  getallusers,
  updateUserRole,
  deleteUser,
  deleteProfile,
  addBookingSession,
  getBookingSession,
  getAllExperts,
  deleteBooking,
  onsiteInspectionReport,
  onlineInspectionReport,
  getOnlineInspection,
  getOnsiteInspection,
  deleteOnlineInspection,
  deleteOnsiteInspection,
  updateOnsiteInspection,
  updateOnlineInspection,
  getallBookingSession,
} from "../controllers/userController.js";
import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/verify").post(isAuthenticated, verify);

router.route("/login").post(login);
router.route("/logout").get(logout);


router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/me").delete(isAuthenticated, deleteProfile);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);
router.route("/addtoplaylist").post(isAuthenticated, addtoplaylist);
router.route("/removetoplaylist").delete(isAuthenticated, removetoplaylist);
router.route("/admin/users").get(getallusers);
router.route("/admin/user/:id").put(updateUserRole).delete(deleteUser);
router.route("/addBookingSession").post(isAuthenticated, addBookingSession)
router.route("/bookingSession/:id").delete(isAuthenticated ,deleteBooking)
// router.route("/RescheduleBooking/:id").put(isAuthenticated,RescheduleBooking);
router.route("/getBookingSession/:id").get(getBookingSession);
router.route("/getAllExperts").get(getAllExperts);
router.route("/onsiteInspectionReport").post(isAuthenticated,onsiteInspectionReport);
router.route("/onlineInspectionReport").post(isAuthenticated,onlineInspectionReport);
router.route("/getOnlineInspection").get(isAuthenticated,getOnlineInspection);
router.route("/getOnsiteInspection").get(isAuthenticated,getOnsiteInspection);
router.route("/deleteOnlineInspection/:id").delete(isAuthenticated,deleteOnlineInspection);
router.route("/deleteOnsiteInspection/:id").delete(isAuthenticated,deleteOnsiteInspection);
router.route("/updateOnsiteInspection/:id").put(isAuthenticated, updateOnsiteInspection);
router.route("/updateOnlineInspection/:id").put(isAuthenticated, updateOnlineInspection);
router.route("/getallBookingSession").get(getallBookingSession);


export default router;
