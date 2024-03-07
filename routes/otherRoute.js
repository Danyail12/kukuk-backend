import  express from "express";
import {adminStats,getaDashboardStats,
    totalData,getBookingSessionsForExpert,
    getallOnlineInspectionForExpert
    ,getallOnsiteInspectionForExpert
    ,getallPocketGarrageForExpert,
    getAllonsiteInspection
    ,getAllOnlineInspection,
    getallPocketGarrage
    ,multipleDeleteForUser,
    multipleDeleteForExpert,
    multipleDeleteForBookingSession,
    multipleDeleteForpocketGarrage,
    multipleDeleteForonsiteInspection,
    multipleDeleteForonlineInspection,
    multipleDeleteForCourses,
    multipleDeleteForProducts,
    multipleDeleteForBooks




} from "../controllers/otherController.js";

import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";




const router = express.Router();

// router.route("/requestCourse").post(requestCourse);
// router.route("/contact").post(contact);

router.route("/admin/stats").get(isAuthenticated,AuthorizedAdmin,adminStats);
router.route("/admin/getaDashboardStats").get(isAuthenticated,AuthorizedAdmin,getaDashboardStats);
router.route("/admin/totalData").get(totalData);
// Assuming you have the express router declared as `router`

// Route for getting all booking sessions for an expert
// router.route("/expert/:expertId/booking-sessions").get(getBookingSessionsForExpert);


// Route for getting all online inspections for an expert
router.route("/admin/expert/:id/OnlineInspectionForExpert").get(getallOnlineInspectionForExpert);

// Route for getting all onsite inspections for an expert
router.route("/admin/expert/:id/OnsiteInspectionForExpert").get(getallOnsiteInspectionForExpert);

// Route for getting all pocket garages for an expert
router.route("/admin/expert/:id/getallPocketGarrageForExpert").get(getallPocketGarrageForExpert);
router.route("/admin/getAllonsiteInspection").get(getAllonsiteInspection);
router.route("/admin/getAllOnlineInspection").get(getAllOnlineInspection);
router.route("/admin/getallPocketGarrage").get(getallPocketGarrage);
router.route("/admin/multipleDeleteForUser").delete(multipleDeleteForUser);
router.route("/admin/multipleDeleteForExpert").delete(multipleDeleteForExpert);
router.route("/admin/multipleDeleteForBookingSession").delete(multipleDeleteForBookingSession);
router.route("/admin/multipleDeleteForpocketGarrage").delete(multipleDeleteForpocketGarrage);
router.route("/admin/multipleDeleteForonsiteInspection").delete(multipleDeleteForonsiteInspection);
router.route("/admin/multipleDeleteForonlineInspection").delete(multipleDeleteForonlineInspection);
router.route("/admin/multipleDeleteForCourses").delete(multipleDeleteForCourses);
router.route("/admin/multipleDeleteForProducts").delete(multipleDeleteForProducts);
router.route("/admin/multipleDeleteForBooks").delete(multipleDeleteForBooks);


export default router;