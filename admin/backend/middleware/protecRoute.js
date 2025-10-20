import Admin from '../models/adminSchema.js';
import jwt from "jsonwebtoken"
const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch student using the correct ObjectId (`decoded.id`)
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach student object to request
        req.admin = admin;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(401).json({ error: "Unauthorized - Invalid or Expired Token" });
    }
};

export default protectRoute;
