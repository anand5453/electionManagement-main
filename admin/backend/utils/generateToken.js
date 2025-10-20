import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user, res) => {
    // Generate a JWT token with user ID & role
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET, // Secret key from .env file
        { expiresIn: "7d" } // Token expires in 7 days
    );

    // Set the token in HTTP-only cookie
    res.cookie("jwt", token, {
        httpOnly: true, // Prevents access from JavaScript
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Lax", 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
    });

    return token;
};
