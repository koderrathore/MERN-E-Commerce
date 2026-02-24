import express from "express";
import {
  addToCart,
  cartProducts,
  removeItem,
  updateQuantity,
} from "../../controllers/cart-controller/index.js";
import {authMiddleWare} from"../../middlewares/auth-middleware/index.js"

const router = express.Router();
router.post("/add-to-cart/:userId/:productId", authMiddleWare,addToCart);
router.get("/cart-products/:userId", authMiddleWare,cartProducts);
router.put("/update-quantity", authMiddleWare,updateQuantity);
router.delete("/remove-item", authMiddleWare,removeItem);

export default router;
