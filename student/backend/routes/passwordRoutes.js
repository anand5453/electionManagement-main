import express from "express";
import { changePassword, forgotPassword, resetPassword } from "../controller/passwordController.js";
import protectRoute from "../middleware/protecRoute.js";

const router = express.Router();

router.post("/change-password",protectRoute, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
