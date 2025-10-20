import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const AdminSignup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    //console.log(formData);
    try {
      const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/auth/signup`,
  formData,
  { headers: { "Content-Type": "application/json" } }
);

      //console.log(response);
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Admin Name" className="w-full p-2 border rounded mb-2" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-2" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded mb-2" onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Sign Up</button>
        </form>
        <p className="text-center text-sm mt-3">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
      </div>
    </div>
    </div>
  );
};

export default AdminSignup;
