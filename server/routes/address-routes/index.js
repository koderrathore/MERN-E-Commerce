import express from"express"
import { addAddress, deleteAddress, editAddress, fetchAddress } from "../../controllers/address-controller/index.js"
import { authMiddleWare } from "../../middlewares/auth-middleware/index.js"

const router = express.Router()
router.post("/add-address",authMiddleWare,addAddress)
router.get("/get-address/:userId",authMiddleWare,fetchAddress)
router.put("/edit-address",authMiddleWare,editAddress)
router.delete("/delete-address",authMiddleWare,deleteAddress)

export default router