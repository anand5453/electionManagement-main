import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Navbar from "../components/navbar";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extract token from URL (assuming format: /reset-password?token=XYZ)
  const { token } = useParams<{ token: string }>();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    console.log(token)
    if (!token) {
      setError("Invalid or missing reset token.");
      setLoading(false);
      return;
    }



    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/password/reset-password/${token}`, { newPassword });
      setMessage("Password reset successful! Redirecting to login...");
      
      setTimeout(() => navigate("/login"), 3000);
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
          <h2 className="text-2xl font-bold text-center">Set New Password</h2>

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

          <form className="mt-4 space-y-4" onSubmit={handleResetPassword}>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
