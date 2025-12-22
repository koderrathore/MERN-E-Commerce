import express from"express"
import { fethShoppingProducts, searchProduct } from "../../controllers/shop-controller/index.js"
const router = express.Router()

router.get("/products",fethShoppingProducts)
router.post("/search/:search",searchProduct)

export default router;