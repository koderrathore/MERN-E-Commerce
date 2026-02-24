import express from"express"
import { checkLogin, loginUser, logOutUser, registerUser } from "../../controllers/auth-controller/index.js"

const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logOut",logOutUser)
router.get("/check-login",checkLogin)

export default router;