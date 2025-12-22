import express from "express";
import {
  addToCart,
  cartProducts,
  removeItem,
  updateQuantity,
} from "../../controllers/cart-controller/index.js";

const router = express.Router();
router.post("/add-to-cart/:userId", addToCart);
router.get("/cart-products/:userId", cartProducts);
router.put("/update-quantity", updateQuantity);
router.delete("/remove-item", removeItem);

export default router;
