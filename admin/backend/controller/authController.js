import bcrypt from "bcryptjs";
import Admin from "../models/adminSchema.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

// **Admin Signup**
export const adminSignup = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate token & set cookie
        const token = generateTokenAndSetCookie(newAdmin, res);

        res.status(201).json({
            message: "Admin registered successfully",
            admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
            token,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// **Admin Login**
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token & set cookie
        const token = generateTokenAndSetCookie(admin, res);

        res.status(200).json({
            message: "Login successful",
            admin: { id: admin._id, name: admin.name, email: admin.email },
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// **Admin Logout**
export const adminLogout = (req, res) => {
    try {
        // Clear JWT cookie
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0), // Expire the cookie immediately
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const checkAuth = (req, res) => {
    const token = req.cookies?.jwt; // Get JWT from cookies
  
    if (!token) {
      return res.status(401).json({ authenticated: false, message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY); // Verify token
      res.status(200).json({ authenticated: true, admin: decoded });
    } catch (error) {
      return res.status(401).json({ authenticated: false, message: "Invalid token" });
    }
};
  
