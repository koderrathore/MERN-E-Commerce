import express from"express"
import { allOrders, allOrdersForAdmin, createOrder, getKey, paymentVerification, updateOrderStatus } from "../../controllers/orders-controller/index.js"
const router = express.Router()

router.get("/key",getKey)
router.post("/create",createOrder)
router.post("/payment-verification",paymentVerification)
router.post("/all-orders/:userId",allOrders)
router.get("/all-orders-for-admin",allOrdersForAdmin)
router.put("/update-order-status",updateOrderStatus)

export default router
