import  express from "express";
// import { registerUser } from "../controllers/userController.js";
import { userLogin } from "../controllers/userController.js";

const router = express.Router();

router.route("/login").post(userLogin);

export default router;