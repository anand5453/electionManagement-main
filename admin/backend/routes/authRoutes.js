import express from 'express'
import { adminLogin, adminLogout, adminSignup, checkAuth} from '../controller/authController.js';

const router=express.Router()
router.post("/login",adminLogin)
router.post("/logout",adminLogout)
router.post("/signup",adminSignup)
router.get("/check",checkAuth)
export default router;