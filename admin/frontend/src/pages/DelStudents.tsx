import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const DeleteStudents = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
      setMessage(""); // Reset message when new file is selected
    }
  };

  // Handle CSV upload and process
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Use file from state

    try {
      const response = await axios.post("http://localhost:8000/students/delete-students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }, withCredentials:true
      });

      setMessage(response.data.message || "Students deleted successfully.");
      setFile(null);
      setFileName("No file chosen");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to delete students. Please check the CSV format.");
    }
    alert("Students deleted successfully!");
    navigate("/admDash");
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Delete Students</h2>

          {/* Styled File Input */}
          <div className="mb-4">
            <label className="flex items-center justify-between w-full bg-gray-200 text-gray-700 rounded px-3 py-2 cursor-pointer hover:bg-gray-300">
              <span>{fileName}</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded ml-2">Choose File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
            disabled={!file}
          >
            Upload & Delete
          </button>

          {/* Message Display */}
          {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeleteStudents;
