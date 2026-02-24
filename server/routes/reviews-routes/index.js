import express from"express"
import { addReviews, productReview } from "../../controllers/reviews-controller/index.js"
import { authMiddleWare } from "../../middlewares/auth-middleware/index.js"
const router = express.Router()

router.post("/add-review",authMiddleWare,addReviews)
router.post("/product-review",productReview)

export default router