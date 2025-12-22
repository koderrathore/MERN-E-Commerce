import express from"express"
import { addAddress, deleteAddress, editAddress, fetchAddress } from "../../controllers/address-controller/index.js"

const router = express.Router()
router.post("/add-address",addAddress)
router.get("/get-address/:userId",fetchAddress)
router.put("/edit-address",editAddress)
router.delete("/delete-address",deleteAddress)

export default router