import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "../components/navbar";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  return emailRegex.test(email);
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        navigate("/admDash");
      }
    } catch (err) {
      console.error("Login failed:", err);
      
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
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
          <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          {error && (
            <div className="mt-3 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <p className="text-sm text-center">{error}</p>
            </div>
          )}
          <form className="mt-4 space-y-4" onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Enter email"
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
            <p className="text-center text-sm mt-3">
              Don't have an account? <Link to="/register" className="text-blue-500">Sign Up as Admin</Link>
            </p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;