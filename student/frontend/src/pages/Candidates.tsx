import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Navbar from "../components/navbar";

interface Candidate {
  _id: string;
  name: string;
}

const Candidates: React.FC = () => {
  const { electionId } = useParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/election/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("student")}`,
            },
            withCredentials: true,
          }
        );
        setCandidates(response.data.candidates);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
        setError("Failed to fetch candidates.");
      }
    };

    fetchCandidates();
  }, [electionId]);

  const handleVote = async (candidateName: string) => {
    try {
      const secretKey = import.meta.env.VITE_SECRET_KEY;
      console.log("secretKey", secretKey);
      // Encrypt candidate name
      const encryptedCandidateName = CryptoJS.AES.encrypt(
        candidateName,
        secretKey
      ).toString();
      console.log("encryptedCandidateName", encryptedCandidateName);
      const isConfirmed = window.confirm("Are you sure you want to cast your vote for this candidate?");
      if (!isConfirmed) return;
      await axios.post(
        `http://localhost:5000/vote/`,
        { electionId, candidateName: encryptedCandidateName }, // Send encrypted name
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("student")}`,
          }, withCredentials: true
        }
      );
      
      alert("Vote cast successfully!");
      navigate("/status"); // Redirect to dashboard after voting
    } catch (err) {
      console.error("Failed to cast vote:", err);
      alert("Failed to cast vote. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-5">
        <h1 className="text-3xl font-bold text-center mb-6">Candidates</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">No candidates found.</p>
          ) : (
            candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
                <h2 className="text-xl font-bold text-center mb-2">{candidate.name}</h2>
                <button
                  onClick={() => handleVote(candidate.name)}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Vote for {candidate.name}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidates;
