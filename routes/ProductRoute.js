import express from "express";
import { AuthorizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import { getProducts, createProduct,deleteProduct } from "../controllers/ProductController.js";



const router = express.Router();


router.route("/products").get(getProducts);
router.route("/createProduct").post(isAuthenticated,AuthorizedAdmin,createProduct);
router.route("/deleteProduct/:id").delete(isAuthenticated,AuthorizedAdmin,deleteProduct);



export default router