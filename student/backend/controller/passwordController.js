import bcrypt from "bcryptjs";
import Student from "../models/studentSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter from "../config/emailConfig.js";

export const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Check if all fields are provided
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;

        // Save updated student data
        await student.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




dotenv.config();

// Forgot Password: Generates Token & Sends Email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Generate Reset Token
        const resetToken = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Save Token & Expiry in DB
        student.resetPasswordToken = resetToken;
        student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await student.save();

        // Send Reset Email
        const resetLink = `http://${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: student.email,
            subject: "Password Reset Request",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link expires in 1 hour.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// ➤ Reset Password: Updates Password in DB
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);

        if (!student || student.resetPasswordToken !== token || student.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash and Update Password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);

        // Clear Reset Token
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
