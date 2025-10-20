import jwt from 'jsonwebtoken';
import Student from '../models/studentSchema.js';

const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.jwt_student;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch student using the correct ObjectId (`decoded.id`)
        const student = await Student.findById(decoded.id).select("-password");
        if (!student) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach student object to request
        req.student = student;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(401).json({ error: "Unauthorized - Invalid or Expired Token" });
    }
};

export default protectRoute;
