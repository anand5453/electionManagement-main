import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

// Utility functions
const createDateTime = (date: string, time: string): Date => new Date(`${date}T${time}:00`);
const getTodayDate = (): string => new Date().toISOString().split('T')[0];
const getCurrentTimeHHMM = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Round up to the next minute
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const ManageElection: React.FC = () => { 
    const todayDate = getTodayDate();
    const [title, setTitle] = useState("");
    const [candidates, setCandidates] = useState([{ name: "" }]); 
    const [startDate, setStartDate] = useState(todayDate); 
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState(todayDate);   
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState<string | null>(null); 
    const [candidateNameError, setCandidateNameError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCandidateChange = (index: number, value: string) => {
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(value)) {
            setCandidateNameError("Only alphabets and spaces are allowed for candidate names.");
            return;
        }
        setCandidateNameError(null);
        const updatedCandidates = [...candidates];
        updatedCandidates[index].name = value;
        setCandidates(updatedCandidates);
    };

    const addCandidate = () => setCandidates([...candidates, { name: "" }]);

    const removeCandidate = (index: number) => {
        if (candidates.length > 1) {
            setCandidates(candidates.filter((_, i) => i !== index));
        } else {
            setError("An election must have at least one candidate.");
        }
    };

    const handleStartDateChange = (date: string) => {
        setStartDate(date);
        if (date > endDate) {
            setEndDate(date);
            setEndTime("");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        const validCandidates = candidates.filter(c => c.name.trim() !== '');
        if (validCandidates.length < 2) {
            setError("An election requires at least 2 candidates to proceed.");
            return;
        }
        if (!startTime || !endTime) {
            setError("Please select both start and end times.");
            return;
        }
        
        const now = new Date();
        const startDateTime = createDateTime(startDate, startTime);
        const endDateTime = createDateTime(endDate, endTime);
        const minDurationMs = 5 * 60 * 1000;

        // Validation checks
        if (startDateTime.getTime() < now.getTime() - 60000) { 
             setError("The start date and time cannot be in the past. Please select a future time.");
             return;
        }
        if (endDateTime.getTime() <= startDateTime.getTime()) {
            setError("The end date and time must be strictly after the start date and time.");
            return;
        }
        if (endDateTime.getTime() - startDateTime.getTime() < minDurationMs) {
            setError("The election duration must be at least 5 minutes.");
            return;
        }
        if (endDateTime.getTime() < now.getTime()) {
             setError("The election end date and time cannot be in the past.");
             return;
        }

        try {
            const response = await axios.post("http://localhost:8000/election/add-election", {
                title,
                candidates: validCandidates, 
                startDate: startDateTime.toISOString(),
                endDate: endDateTime.toISOString(),
            }, { withCredentials: true });

            if (response.status === 201) {
                setSuccess("Election created successfully! Redirecting...");
                setTitle("");
                setCandidates([{ name: "" }]);
                setStartDate(todayDate);
                setStartTime("");
                setEndDate(todayDate);
                setEndTime("");
                setTimeout(() => navigate("/admDash"), 1500); 
            }
        } catch (err) {
            console.error("Error adding election:", err);
            setError("Failed to create election. Please try again.");
        }
    };

    const minStartTime = startDate === todayDate ? getCurrentTimeHHMM() : "00:00";
    const minEndTime = endDate === todayDate ? getCurrentTimeHHMM() : endDate === startDate ? startTime : "00:00";


    return (
        <div>
            <Navbar/>
            <div className="max-w-lg mx-auto mt-8 p-4 border rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Manage Election</h2> 
                
                {/* 🛑 CSS FIX: Added w-full and whitespace-normal to ensure text wraps correctly */}
                {error && (
                    <Alert className="w-full text-red-500 mb-2 p-2 bg-red-100 rounded whitespace-normal">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert className="w-full text-green-500 mb-2 p-2 bg-green-100 rounded whitespace-normal">
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Election Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mb-4"
                    />

                    <h3 className="text-lg font-semibold mb-2">Candidates</h3>
                    {candidates.map((candidate, index) => (
                        <div key={index} className="mb-2 flex space-x-2 items-start">
                            <div className="flex-grow">
                                <Input
                                    type="text"
                                    placeholder="Candidate Name"
                                    value={candidate.name} 
                                    onChange={(e) => handleCandidateChange(index, e.target.value)}
                                    required
                                />
                                {index === candidates.length - 1 && candidateNameError && (
                                     <p className="text-red-500 text-xs mt-1">{candidateNameError}</p>
                                )}
                            </div>
                            <Button 
                                type="button" 
                                onClick={() => removeCandidate(index)} 
                                className="bg-red-500 text-white w-10 h-10 flex-shrink-0"
                                disabled={candidates.length <= 1}
                            >
                                -
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={addCandidate} className="mb-4">+ Add Candidate</Button>

                    <h3 className="text-lg font-semibold mt-4 mb-1">Start Date and Time</h3> 
                    <Input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        required 
                        className="mb-2" 
                        min={todayDate} 
                    />
                    <Input 
                        type="time" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        required 
                        className="mb-4" 
                        min={minStartTime}
                    />
                    
                    <h3 className="text-lg font-semibold mt-4 mb-1">End Date and Time</h3>
                    <Input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        className="mb-2" 
                        min={startDate}
                    />
                    <Input 
                        type="time" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        required 
                        className="mb-4" 
                        min={minEndTime}
                    />

                    <Button type="submit" className="w-full">Create Election</Button>
                </form>
            </div>
        </div>
    );
};

export default ManageElection;