import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const AdminSignup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate name field in real-time
    if (name === "name") {
      if (value && !/^[a-zA-Z\s]+$/.test(value)) {
        setNameError("Name should only contain letters and spaces");
      } else {
        setNameError("");
      }
    }

    // Validate email field in real-time
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address (e.g., user@gmail.com)");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate name: only letters and spaces allowed
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError("Name should only contain letters and spaces");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Admin Registered Successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Admin Signup</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Admin Name"
                className={`w-full p-2 border rounded ${nameError ? 'border-red-500' : ''}`}
                onChange={handleChange}
                value={formData.name}
                required
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>

            <div className="mb-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`w-full p-2 border rounded ${emailError ? 'border-red-500' : ''}`}
                onChange={handleChange}
                value={formData.email}
                required
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded mb-2"
              onChange={handleChange}
              value={formData.password}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm mt-3">
            Already have an account? <a href="/login" className="text-blue-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;