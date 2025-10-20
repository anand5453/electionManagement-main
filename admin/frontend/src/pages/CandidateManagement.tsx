import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const CandidateManagement: React.FC = () => {
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", position: "" }]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCandidateChange = (index: number, field: string, value: string) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field as keyof typeof candidates[0]] = value;
    setCandidates(updatedCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", position: "" }]);
  };

  const removeCandidate = (index: number) => {
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:8000/election/add-election", {
        title,
        candidates,
        startDate,
        startTime,
        endDate,
        endTime,
      },{withCredentials:true});

      if (response.status === 201) {
        setSuccess("Election created successfully!");
        setTitle("");
        setCandidates([{ name: "", position: "" }]);
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
      }
    } catch (err) {
      console.error("Error adding election:", err);
      setError("Failed to create election. Please try again.");
    }
    alert("Election created successfully!");
    navigate("/admDash");
  };

  return (
    <div>
      <Navbar/>
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Election</h2>
      {error && <Alert className="text-red-500">{error}</Alert>}
      {success && <Alert className="text-green-500">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Election Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mb-2"
        />

        {candidates.map((candidate, index) => (
          <div key={index} className="mb-2 flex space-x-2">
            <Input
              type="text"
              placeholder="Candidate Name"
              value={candidate.name}
              onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
              required
            />
            <Button type="button" onClick={() => removeCandidate(index)} className="bg-red-500 text-white">-</Button>
          </div>
        ))}

        <Button type="button" onClick={addCandidate} className="mb-2">+ Add Candidate</Button>

        <Input type="date" value={startDate} placeholder="Start Date:" onChange={(e) => setStartDate(e.target.value)} required className="mb-2" />
        <Input type="time" value={startTime} placeholder="Start Time:"onChange={(e) => setStartTime(e.target.value)} required className="mb-2" />
        <Input type="date" value={endDate} placeholder="End Date:" onChange={(e) => setEndDate(e.target.value)} required className="mb-2" />
        <Input type="time" value={endTime} placeholder="End Time:" onChange={(e) => setEndTime(e.target.value)} required className="mb-4" />

        <Button type="submit" className="w-full">Create Election</Button>
      </form>
    </div>
    </div>
  );
};

export default CandidateManagement;
