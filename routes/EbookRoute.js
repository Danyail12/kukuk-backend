import  express  from "express";
import { getEBooks, getEbookPdf, deleteEbook, createEbooks,addEbook } from "../controllers/eBookController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.route("/ebook").get(getEBooks);
router.route("/createEbook").post(isAuthenticated,createEbooks);
router.route("/ebook/:id").get(AuthorizedSubscriber,getEbookPdf).post(isAuthenticated,AuthorizedAdmin ,addEbook );
router.route("/deleteEbook/:id").delete(isAuthenticated,AuthorizedAdmin ,deleteEbook);


export default router;