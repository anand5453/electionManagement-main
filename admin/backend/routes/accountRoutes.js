import express from "express";
import { uploadStudents, deleteStudentsFromCSV } from "../controller/accountsController.js";
import multer from "multer";
import protectRoute from "../middleware/protecRoute.js";

// Configure Multer to store uploaded files in the "uploads/" directory
const upload = multer({ dest: "uploads/" });

// Middleware function to handle file upload
const uploadMiddleware = upload.single("file");

const router = express.Router();

router.post("/upload-students", protectRoute, uploadMiddleware, uploadStudents);
router.post("/delete-students", protectRoute, uploadMiddleware, deleteStudentsFromCSV);

export default router;
