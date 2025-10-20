import express from 'express'
import { login,logout, sendOTP, verifyOTP} from '../controller/authController.js';

const router=express.Router()
router.post("/login",login)
router.post("/logout",logout)
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router