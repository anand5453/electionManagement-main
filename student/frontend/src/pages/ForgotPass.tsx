import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:5000/password/forgot-password", { email });
      console.log("response", response.data);
      // Assuming backend sends a reset token (if required) or just a success message
      setMessage("A password reset link has been sent to your email.");
      
      // Navigate after a short delay
      setTimeout(() => navigate("/reset-password"), 3000);
      
    } catch (err: unknown) {
      console.error("Password reset failed:", err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>

          {message && (
            <Alert className="mt-3 bg-green-100 p-2 text-center rounded-md">
              <AlertTitle className="text-green-700 font-semibold">Success</AlertTitle>
              <AlertDescription className="text-green-600">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mt-3 bg-red-100 p-2 text-center rounded-md">
              <AlertTitle className="text-red-700 font-semibold">Error</AlertTitle>
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <form className="mt-4 space-y-4" onSubmit={handleResetRequest}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center mt-3">
            <Button onClick={() => navigate("/login")} variant="outline">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
