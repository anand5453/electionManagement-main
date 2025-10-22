import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [camReady, setCamReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle login with face recognition
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Open camera
    setCameraOpen(true);
  };

  // Capture image and send to backend
  const captureAndLogin = async () => {
    if (!webcamRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Capture a frame as base64 image
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        setError("Could not capture image. Try again.");
        return;
      }

      // Send email, password, and captured face image
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password, faceImage: imageSrc },
        { withCredentials: true }
      );

      localStorage.setItem("student", JSON.stringify(response.data.student));
      navigate("/home");
    } catch (err: unknown) {
      console.error("Login failed:", err);

      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Face verification failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setCameraOpen(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h2 className="text-2xl font-bold text-center">Student Login</h2>

          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {!cameraOpen ? (
            <form className="mt-4 space-y-4" onSubmit={handlePasswordLogin}>
              <Input
                type="email"
                placeholder="Enter email (e.g., student@domain.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-left mt-3">
                <Link to="/forgot" className="text-blue-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login with Face"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center mt-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
                className="rounded-md border"
                onUserMedia={() => setCamReady(true)}
                videoConstraints={{
                  width: 320,
                  height: 240,
                  facingMode: "user",
                }}
              />
              <p className="text-gray-600 mt-2">Align your face and click Capture</p>
              <Button
                onClick={captureAndLogin}
                disabled={!camReady || loading}
                className="mt-3 w-full"
              >
                {loading ? "Verifying..." : "Capture & Login"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;