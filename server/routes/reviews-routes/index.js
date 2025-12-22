import express from"express"
import { addReviews, productReview } from "../../controllers/reviews-controller/index.js"
const router = express.Router()

router.post("/add-review",addReviews)
router.post("/product-review",productReview)

export default router