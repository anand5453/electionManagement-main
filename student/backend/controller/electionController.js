import Election from "../models/electionSchema.js";
import Student from "../models/studentSchema.js"

export const getElections = async (req, res) => {
    try {
        const studentId = req.student._id; // Get logged-in student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Get all elections
        
        const allElections = await Election.find();

        // Filter elections where the student hasn't voted yet
        const electionsNotVoted = allElections.filter(election => 
            !student.hasVoted.includes(election._id)
        );

        res.status(200).json(electionsNotVoted);
    } catch (error) {
        console.error("Error fetching elections:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getElectionById = async (req, res) => {
    try {
        const { id } = req.params; // Extract election ID from request URL

        // Find the election by ID
        const election = await Election.findById(id);

        // If no election is found, return a 404 error
        if (!election) {
            return res.status(404).json({ error: "Election not found" });
        }

        // Return the election details
        res.status(200).json(election);
    } catch (error) {
        console.error("Error fetching election by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


