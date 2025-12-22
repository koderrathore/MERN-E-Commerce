import express from"express"
import { addToCart, cartProducts, removeItem, updateQuantity } from "../../controllers/cart-controller/index.js"

const router = express.Router()
router.post("/add-to-cart",addToCart)
router.get("/cart-products",cartProducts)
router.put("/update-quantity",updateQuantity)
router.delete("/remove-item",removeItem)

export default router