import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Election {
    _id: string;
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
}

const ElectionList = () => {
    const navigate = useNavigate();
    const [elections, setElections] = useState<Election[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const response = await axios.get("http://localhost:8000/election/get-elections", { withCredentials: true });
            setElections(response.data);
        } catch (err) {
            setError("Failed to fetch elections");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteElection = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this election?");
        if (!isConfirmed) return; // If user cancels, do nothing
        console.log(id);
        try {
            await axios.delete(`http://localhost:8000/election/delete-election/${id}`);
            setElections(elections.filter((election) => election._id !== id));
        } catch (err) {
            setError("Failed to delete election");
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Election List</h2>

                {loading && <p className="text-blue-500 text-center">Loading elections...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {elections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48">
                    <p className="text-center text-gray-600">No elections found</p>
                    <Button onClick={() => navigate("/admDash")} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 transition">Back</Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="p-3 border">Title</th>
                                    <th className="p-3 border">Start Date</th>
                                    <th className="p-3 border">Start Time</th>
                                    <th className="p-3 border">End Date</th>
                                    <th className="p-3 border">End Time</th>
                                    <th className="p-3 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elections.map((election) => (
                                    <tr key={election._id} className="hover:bg-gray-100 transition">
                                        <td className="p-3 border">{election.title}</td>
                                        <td className="p-3 border">{new Date(election.startDate).toISOString().split("T")[0]}</td>
                                        <td className="p-3 border">{election.startTime}</td>
                                        <td className="p-3 border">{new Date(election.endDate).toISOString().split("T")[0]}</td>
                                        <td className="p-3 border">{election.endTime}</td>
                                        <td className="p-3 border text-center">
                                            <button
                                                onClick={() => deleteElection(election._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <div className="flex flex-col items-center justify-center h-48">
                        <Button onClick={() => navigate("/admDash")} className="bg-green-500 text-white px-6 py-3 text-lg rounded-md hover:bg-green-700 transition">
                            Back
                        </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ElectionList;
