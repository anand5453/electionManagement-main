import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";

interface Election {
  _id: string;
  title: string;
  status: "Not Started" | "Ongoing" | "Ended";
}

const ElectionControl: React.FC = () => {
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElectionStatus = async () => {
    try {
      const response = await axios.get("/api/elections/current"); // Adjust API route
      setElection(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching election:", err);
      setError("Failed to load election data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartElection = async () => {
    try {
      await axios.post(`/api/elections/${election?._id}/start`);
      fetchElectionStatus();
    } catch (err) {
      console.error("Error starting election:", err);
      setError("Failed to start the election.");
    }
  };

  const handleEndElection = async () => {
    try {
      await axios.post(`/api/elections/${election?._id}/end`);
      fetchElectionStatus();
    } catch (err) {
      console.error("Error ending election:", err);
      setError("Failed to end the election.");
    }
  };

  useEffect(() => {
    fetchElectionStatus();
  }, []);

  return (
    <div>
      <Navbar/>
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Election Control</h2>

        {loading ? <p>Loading election data...</p> : null}
        {error ? <Alert className="text-red-500">{error}</Alert> : null}

        {election && (
          <>
            <p className="text-lg font-semibold">Title: {election.title}</p>
            <p className="text-lg">Status: <span className="font-bold">{election.status}</span></p>

            <div className="mt-4 space-x-2">
              {election.status === "Not Started" && (
                <Button onClick={handleStartElection} className="bg-green-600">Start Election</Button>
              )}
              {election.status === "Ongoing" && (
                <Button onClick={handleEndElection} className="bg-red-600">End Election</Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
    </div>
  );
};

export default ElectionControl;
