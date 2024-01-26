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
router.route("/admin/users").get(isAuthenticated,AuthorizedAdmin ,getallusers);
router.route("/admin/user/:id").put(isAuthenticated,AuthorizedAdmin ,updateUserRole).delete(isAuthenticated,AuthorizedAdmin ,deleteUser);
export default router;
