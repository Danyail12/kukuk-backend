import  express from "express";
import {} from "../controllers/paymentController.js";

import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";




const router = express.Router();




export default router;