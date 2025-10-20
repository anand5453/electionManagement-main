import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";
import Navbar from "../components/navbar";

interface Candidate {
  id: number;
  name: string;
  position: string;
  votes: number;
}

interface Election {
  id: number;
  title: string;
  startDate: string; // Stored as ISO format in DB
  endDate: string; // Stored as ISO format in DB
  startTime: string; // Stored as ISO format in DB
  endTime: string;
  candidates: Candidate[];
}

const Results: React.FC = () => {
  const [ongoingElections, setOngoingElections] = useState<Election[]>([]);
  const [completedElections, setCompletedElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const parseDateTime = (dateObj: string, timeStr: string) => {
    if (!dateObj || !timeStr) {
      console.error("Invalid date/time:", { dateObj, timeStr });
      throw new Error("Invalid date or time format.");
    }
  
    const datePart = new Date(dateObj).toISOString().split("T")[0];
    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  
    // Construct UTC time string
    const dateTimeString = `${datePart}T${formattedTime}Z`;
    const utcDate = new Date(dateTimeString);
  
    if (isNaN(utcDate.getTime())) {
      console.error("Failed to parse:", { dateObj, timeStr, formattedTime });
      throw new Error("Invalid date-time value.");
    }
  
    // Convert UTC time to local time
    const localDate = new Date(utcDate.getTime() + new Date().getTimezoneOffset() * 60000);
  
    return localDate;
  };
  

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get("http://localhost:8000/election/get-elections",
          { withCredentials: true }
        );
        const allElections: Election[] = response.data;
    
        //console.log("Fetched Elections:", allElections);
    
        const now = new Date();
        //console.log("Current Time:", now.toISOString());
    
        const ongoing = allElections.filter((election) => {
          console.log("Checking Election:", election.title);
    
          try {
            const startTime = parseDateTime(election.startDate, election.startTime);
            const endTime = parseDateTime(election.endDate, election.endTime);
    
            //console.log(`Start: ${startTime.toISOString()}, End: ${endTime.toISOString()}`);
    
            return startTime <= now && now < endTime;
          } catch (error) {
            console.error("Error parsing dates:", error);
            return false; // Skip this election if dates are invalid
          }
        });
    
        const completed = allElections.filter((election) => {
          try {
            const endTime = parseDateTime(election.endDate, election.endTime);
            //console.log("Completed Election End Time:", endTime.toISOString());
            //console.log(now);
            return now > endTime;
          } catch (error) {
            console.error("Error parsing completed election dates:", error);
            return false;
          }
        });
    
        console.log("Ongoing Elections:", ongoing);
        console.log("Completed Elections:", completed);
    
        setOngoingElections(ongoing);
        setCompletedElections(completed);
        setError(null);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections(); // Fetch initially
    const interval = setInterval(fetchElections, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Election Results</h2>
          {loading && <p className="text-center text-gray-600">Loading results...</p>}
          {error && (
            <Alert className="mt-2 bg-red-100 p-2 text-center rounded-md">
              <span className="text-red-700 font-semibold">{error}</span>
            </Alert>
          )}

          {/* Live Results Section */}
        <Card className="w-full max-w-3xl p-6 shadow-md bg-white">

          {ongoingElections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-center text-blue-600">🔴 Live Election Results</h3>
              {ongoingElections.map((election) => (
                <div key={election.id} className="mb-6">
                  <h4 className="text-lg font-semibold text-center">{election.title}</h4>
                  <p className="text-center text-gray-500 mb-2">
                    Voting in progress (Ends on: {parseDateTime(election.endDate, election.endTime).toLocaleString()})
                  </p>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-200">
                        <TableHead className="text-center">Candidate</TableHead>
                        <TableHead className="text-center">Votes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {election.candidates.map((candidate) => (
                        <TableRow key={candidate.id} className="text-center">
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.votes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
          </Card>
          {/* Completed Results Section */}
        <Card className="w-full max-w-3xl p-6 shadow-md bg-white">

          {completedElections.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-center text-green-600">✅ Final Election Results</h3>
              {completedElections.map((election) => (
                <div key={election.id} className="mb-6">
                  <h4 className="text-lg font-semibold text-center">{election.title}</h4>
                  <p className="text-center text-gray-500 mb-2">
                    Election ended on: {parseDateTime(election.endDate, election.endTime).toLocaleString()}
                  </p>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-200">
                        <TableHead className="text-center">Candidate</TableHead>
                        <TableHead className="text-center">Final Votes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {election.candidates.map((candidate) => (
                        <TableRow key={candidate.id} className="text-center">
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell className="font-bold">{candidate.votes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}

          {/* No Elections Message */}
          {!loading && !error && ongoingElections.length === 0 && completedElections.length === 0 && (
            <p className="text-center text-gray-500">No election data available.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Results;
