import  express  from "express";
import { getEBooks, getEbookPdf, deleteEbook, createEbooks,addEbook ,addToReadEbook} from "../controllers/eBookController.js";
import { AuthorizedAdmin, AuthorizedSubscriber, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.route("/ebook").get(getEBooks);
router.route("/createEbook").post(createEbooks);
router.route("/ebook/:id").get(AuthorizedSubscriber,getEbookPdf).post(addEbook );
router.route("/deleteEbook/:id").delete(isAuthenticated,AuthorizedAdmin ,deleteEbook);
router.route("/readEbook").post(isAuthenticated, addToReadEbook);



export default router;