import express from "express";
import { upload } from "../../config/cloudinary.js";
import { addProducts, deleteProducts, fethProducts, handleImageUpload, updateProducts } from "../../controllers/products-controller/index.js";

const router = express.Router();
router.post("/upload-image", upload.single("image"), handleImageUpload);
router.post("/addProducts",upload.single("image"),addProducts)
router.get("/fetchProducts",fethProducts)
router.put("/updateProducts/:id",upload.single("image"),updateProducts)
router.delete("/deleteProducts/:id",deleteProducts)

export default router;
