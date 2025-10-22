import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-700">
                To reset your password, please contact your administrator.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button onClick={() => navigate("/login")} className="w-full">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;