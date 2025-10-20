import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";

// Define the type for the candidate prop
interface Candidate {
  id: string;
  name: string;
  photo: string;
  manifesto: string;
}

// Define props for the Vote component
interface VoteProps {
  candidate: Candidate;
  electionId: string;
}

const Vote: React.FC<VoteProps> = ({ candidate, electionId }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    try {
      const response = await axios.post<{ message: string }>(
        `/api/vote/${electionId}`, // Pass electionId in the URL
        { candidateName: candidate.name }, // Send candidateName in request body
        { withCredentials: true } // Ensure cookies (JWT) are sent
      );
      setSuccess(true);
      setError(null);
      console.log("Vote Response:", response.data.message);
    } catch (err) {
      setSuccess(false);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Voting failed!");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <Navbar/>
    <Card className="max-w-md mx-auto mt-10 p-6">
      <h2 className="text-xl font-bold text-center">{candidate.name}</h2>
      <img src={candidate.photo} alt={candidate.name} className="w-24 h-24 rounded-full mx-auto mt-4" />
      <p className="text-center mt-2">{candidate.manifesto}</p>
      
      {success ? (
        <Alert className="mt-4 text-green-600">✅ Vote cast successfully!</Alert>
      ) : (
        <>
          {error && <Alert className="mt-4 text-red-600">❌ {error}</Alert>}
          <Button className="w-full mt-4" onClick={handleVote}>
            Confirm Vote
          </Button>
        </>
      )}
    </Card>
    </div>
  );
};

export default Vote;
