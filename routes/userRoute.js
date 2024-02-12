import express from "express";
import {
  addTask,
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  removeTask,
  resetPassword,
  updatePassword,
  updateProfile,
  updateTask,
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
  RescheduleBooking,
  deleteBooking
} from "../controllers/userController.js";
import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/verify").post(isAuthenticated, verify);

router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/newtask").post(isAuthenticated, addTask);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/me").delete(isAuthenticated, deleteProfile);

// router
//   .route("/task/:taskId")
//   .get(isAuthenticated, updateTask)
//   .delete(isAuthenticated, removeTask);

router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);

router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);
router.route("/addtoplaylist").post(isAuthenticated, addtoplaylist);
router.route("/removetoplaylist").delete(isAuthenticated, removetoplaylist);
router.route("/admin/users").get(getallusers);
router.route("/admin/user/:id").put(isAuthenticated,AuthorizedAdmin ,updateUserRole).delete(deleteUser);
router.route("/addBookingSession").post(isAuthenticated, addBookingSession)
router.route("/bookingSession/:id").delete(isAuthenticated ,deleteBooking)
router.route("/RescheduleBooking/:id").put(isAuthenticated,RescheduleBooking);
router.route("/getBookingSession/:id").get(getBookingSession);
router.route("/getAllExperts").get(isAuthenticated,AuthorizedAdmin ,getAllExperts);
export default router;
