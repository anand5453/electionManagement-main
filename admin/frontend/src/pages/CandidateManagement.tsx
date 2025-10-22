import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const CandidateManagement: React.FC = () => {
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", position: "" }, { name: "", position: "" }]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Validation function for candidate names
  const validateCandidateName = (name: string): boolean => {
    // Check if name contains only alphabets and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    // Check if name is not empty or only spaces
    const trimmedName = name.trim();
    return nameRegex.test(name) && trimmedName.length > 0;
  };

  // Get current date and time in the required format
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  const handleCandidateChange = (index: number, field: string, value: string) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field as keyof typeof candidates[0]] = value;
    setCandidates(updatedCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", position: "" }]);
  };

  const removeCandidate = (index: number) => {
    // Prevent removing candidates if only 2 remain (minimum requirement)
    if (candidates.length <= 2) {
      setError("At least 2 candidates are required for an election.");
      return;
    }
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    // If end date is before new start date, clear end date
    if (endDate && value && endDate < value) {
      setEndDate("");
    }
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    // If start date is today and end time is before new start time, clear end time
    const currentDateTime = getCurrentDateTime();
    if (startDate === currentDateTime.date && endTime && value && endTime < value) {
      setEndTime("");
    }
  };

  const handleEndDateChange = (value: string) => {
    // Prevent selecting end date before start date
    if (startDate && value && value < startDate) {
      setError("End date must be after start date.");
      return;
    }
    setEndDate(value);
    setError(null);
  };

  const handleEndTimeChange = (value: string) => {
    // If end date is same as start date, ensure end time is after start time
    if (startDate === endDate && startTime && value && value <= startTime) {
      setError("End time must be after start time when dates are the same.");
      return;
    }
    setEndTime(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate minimum candidates
    if (candidates.length < 2) {
      setError("At least 2 candidates are required for an election.");
      return;
    }

    // Validate candidate names
    for (let i = 0; i < candidates.length; i++) {
      if (!validateCandidateName(candidates[i].name)) {
        setError(`Enter a Valid Candidate name!`);
        return;
      }
    }

    // Validate dates and times
    const currentDateTime = getCurrentDateTime();
    
    // Check if start date/time is in the past
    if (startDate < currentDateTime.date || 
        (startDate === currentDateTime.date && startTime < currentDateTime.time)) {
      setError("Election start date and time cannot be in the past.");
      return;
    }

    // Check if end date/time is after start date/time
    if (endDate < startDate || 
        (endDate === startDate && endTime <= startTime)) {
      setError("Election end date and time must be after start date and time.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/election/add-election", {
        title,
        candidates,
        startDate,
        startTime,
        endDate,
        endTime,
      }, { withCredentials: true });

      if (response.status === 201) {
        setSuccess("Election created successfully!");
        setTitle("");
        setCandidates([{ name: "", position: "" }, { name: "", position: "" }]);
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
        setTimeout(() => {
          navigate("/admDash");
        }, 1500);
      }
    } catch (err) {
      console.error("Error adding election:", err);
      setError("Failed to create election. Please try again.");
    }
  };

  const currentDateTime = getCurrentDateTime();

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto mt-8 p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Create Election</h2>
        {error && <Alert className="text-red-500 mb-4 whitespace-nowrap">{error}</Alert>}
        {success && <Alert className="text-green-500 mb-4">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Election Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-4"
          />

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Candidates</h3>
            {candidates.map((candidate, index) => (
              <div key={index} className="mb-2 flex space-x-2">
                <Input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                  required
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => removeCandidate(index)} 
                  className="bg-red-500 text-white px-3"
                  disabled={candidates.length <= 2}
                >
                  -
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addCandidate} className="mt-2">
              + Add Candidate
            </Button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Start Date & Time</h3>
            <Input 
              type="date" 
              value={startDate} 
              min={currentDateTime.date}
              onChange={(e) => handleStartDateChange(e.target.value)} 
              required 
              className="mb-2" 
            />
            <Input 
              type="time" 
              value={startTime} 
              min={startDate === currentDateTime.date ? currentDateTime.time : undefined}
              onChange={(e) => handleStartTimeChange(e.target.value)} 
              required 
              className="mb-2" 
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">End Date & Time</h3>
            <Input 
              type="date" 
              value={endDate} 
              min={startDate || currentDateTime.date}
              onChange={(e) => handleEndDateChange(e.target.value)} 
              required 
              className="mb-2" 
            />
            <Input 
              type="time" 
              value={endTime} 
              min={startDate === endDate ? startTime : undefined}
              onChange={(e) => handleEndTimeChange(e.target.value)} 
              required 
              className="mb-4" 
            />
          </div>

          <Button type="submit" className="w-full">
            Create Election
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CandidateManagement;