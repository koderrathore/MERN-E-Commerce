import express from "express";
import { upload } from "../../config/cloudinary.js";
import { addProducts, deleteProducts, fethProducts, handleImageUpload, updateProducts } from "../../controllers/products-controller/index.js";
import { authMiddleWare, roleMiddleware } from "../../middlewares/auth-middleware/index.js";

const router = express.Router();
router.post("/upload-image", upload.single("image"), authMiddleWare,roleMiddleware,handleImageUpload);
router.post("/addProducts",upload.single("image"),authMiddleWare,roleMiddleware,addProducts)
router.get("/fetchProducts",authMiddleWare,roleMiddleware,fethProducts)
router.put("/updateProducts/:id",upload.single("image"),authMiddleWare,roleMiddleware,updateProducts)
router.delete("/deleteProducts/:id",authMiddleWare,roleMiddleware,deleteProducts)

export default router;
