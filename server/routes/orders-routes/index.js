import express from"express"
import { allOrders, allOrdersForAdmin, createOrder, getKey, paymentVerification, updateOrderStatus } from "../../controllers/orders-controller/index.js"
import { authMiddleWare } from "../../middlewares/auth-middleware/index.js"
const router = express.Router()

router.get("/key",authMiddleWare,getKey)
router.post("/create",authMiddleWare,createOrder)
router.post("/payment-verification",authMiddleWare,paymentVerification)
router.get("/all-orders/:userId",authMiddleWare,allOrders)
router.get("/all-orders-for-admin",authMiddleWare,allOrdersForAdmin)
router.put("/update-order-status",authMiddleWare,updateOrderStatus)

export default router
