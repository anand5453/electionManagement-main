import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    position: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
