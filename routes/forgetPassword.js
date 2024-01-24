import  express from "express";
import { forgetPassword } from "../controllers/forgetPassword.js";

const router = express.Router();

router.route(":id/password").put(forgetPassword);

export default router;