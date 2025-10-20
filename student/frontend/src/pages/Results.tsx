import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Candidate {
  _id: string;
  name: string;
  votes: number;
}

interface Election {
  _id: string;
  title: string;
  candidates: Candidate[];
}

const Results: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get<Election>(`http://localhost:5000/election/${electionId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("student")}`,
          },
        });
        setElection(response.data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to fetch election results.");
      }
    };

    fetchResults();
  }, [electionId]);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-5">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {election ? (
          <div>
            <h1 className="text-3xl font-bold text-center mb-6">Results for the {election.title} elections</h1>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3 text-left">Candidate</th>
                  <th className="border border-gray-300 p-3 text-left">Votes</th>
                </tr>
              </thead>
              <tbody>
                {election.candidates
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate) => (
                    <tr key={candidate._id} className="border border-gray-300">
                      <td className="border border-gray-300 p-3">{candidate.name}</td>
                      <td className="border border-gray-300 p-3">{candidate.votes}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          <Button className="mt-4" onClick={() => navigate("/home")}>
          Return to Home
          </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading results...</p>
        )}
      </div>
    </div>
  );
};

export default Results;
