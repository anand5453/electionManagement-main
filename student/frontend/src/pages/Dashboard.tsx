import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

interface Election {
  _id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const Dashboard: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get<Election[]>("http://localhost:5000/election/home", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("student")}`,
          },
        });
        setElections(response.data);
      } catch (err) {
        console.error("Failed to fetch elections:", err);
        setError("Failed to fetch elections.");
      }
    };

    const token = localStorage.getItem("student");
    if (!token) {
      setError("User not authenticated");
      return;
    }
    fetchElections();
  }, []);

  const handleViewCandidates = (electionId: string) => {
    console.log("electionId", electionId);
    navigate(`/election/${electionId}`);
  };

  const handleViewResults = (electionId: string) => {
    console.log("Viewing results for:", electionId);
    navigate(`/results/${electionId}`);
  };

  // Utility function to convert Date + Time to a comparable Date object
  const parseDateTime = (dateStr: string, timeStr: string) => {
    const datePart = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (isNaN(datePart.getTime()) || isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid date or time:", { dateStr, timeStr });
      return null;
    }

    datePart.setHours(hours, minutes, 0, 0);
    return datePart;
  };

  const now = new Date();

  // Filter Ongoing Elections
  const ongoingElections = elections.filter((election) => {
    const startDateTime = parseDateTime(election.startDate, election.startTime);
    const endDateTime = parseDateTime(election.endDate, election.endTime);
    return startDateTime && endDateTime && now >= startDateTime && now <= endDateTime;
  });

  // Filter Completed Elections
  const completedElections = elections.filter((election) => {
    const endDateTime = parseDateTime(election.endDate, election.endTime);
    return endDateTime && now > endDateTime;
  });

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-5">
        <h1 className="text-3xl font-bold text-center mb-6">Ongoing Elections</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingElections.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">No elections currently ongoing.</p>
          ) : (
            ongoingElections.map((election) => (
              <div key={election._id} className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
                <h2 className="text-xl font-bold mb-2">{election.title} Election</h2>
                <p className="text-gray-700">
                  <strong>Start:</strong> {new Date(election.startDate).toISOString().split("T")[0]} {election.startTime}
                </p>
                <p className="text-gray-700">
                  <strong>End:</strong> {new Date(election.endDate).toISOString().split("T")[0]} {election.endTime}
                </p>
                <button
                  onClick={() => handleViewCandidates(election._id)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  View Candidates & Vote
                </button>
              </div>
            ))
          )}
        </div>

        {/* Completed Elections Section */}
        <h1 className="text-3xl font-bold text-center mt-12 mb-6">Completed Elections</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedElections.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">No completed elections available.</p>
          ) : (
            completedElections.map((election) => (
              <div key={election._id} className="bg-gray-100 shadow-lg rounded-lg p-5 border border-gray-300">
                <h2 className="text-xl font-bold mb-2">{election.title} Election</h2>
                <p className="text-gray-700">
                  <strong>Ended On:</strong> {new Date(election.endDate).toISOString().split("T")[0]} {election.endTime}
                </p>
                <button
                  onClick={() => handleViewResults(election._id)}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  View Results
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
