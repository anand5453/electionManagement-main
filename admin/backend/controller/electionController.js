import Election from "../models/electionSchema.js";

export const addElection = async (req, res) => {
    try {
        const { title, candidates, startDate, startTime, endDate, endTime } = req.body;
        console.log(req.body)
        // Validate required fields
        if (!title || !candidates || candidates.length === 0 || !startDate || !startTime || !endDate || !endTime) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Ensure each candidate has a name and position
        for (const candidate of candidates) {
            if (!candidate.name) {
                return res.status(400).json({ error: "Each candidate must have a name and position" });
            }
        }

        // Determine the status based on current time
        const currentTime = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Create new election
        const newElection = new Election({
            title,
            candidates,
            startDate,
            startTime,
            endDate,
            endTime,
        });

        // Save to database
        await newElection.save();

        res.status(201).json({ message: "Election created successfully", election: newElection });
    } catch (error) {
        console.error("Error creating election:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find();
        res.status(200).json(elections);
    } catch (error) {
        console.error("Error fetching elections:", error);
        res.status(500).json({ error: "Failed to fetch elections" });
    }
};

export const getElectionById = async (req, res) => {
    try {
        const { id } = req.params; // Get election ID from request params
        const election = await Election.findById(id);

        if (!election) {
            return res.status(404).json({ error: "Election not found" });
        }

        res.status(200).json(election);
    } catch (error) {
        console.error("Error fetching election:", error);
        res.status(500).json({ error: "Failed to fetch election" });
    }
};

export const deleteElectionById = async (req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params; // Get election ID from request params
        const deletedElection = await Election.findByIdAndDelete(id);

        if (!deletedElection) {
            return res.status(404).json({ error: "Election not found" });
        }

        res.status(200).json({ message: "Election deleted successfully" });
    } catch (error) {
        console.error("Error deleting election:", error);
        res.status(500).json({ error: "Failed to delete election" });
    }
};