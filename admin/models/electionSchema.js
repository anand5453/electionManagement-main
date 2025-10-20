import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    candidates: [
        {
            name: String,
            position: String,
            votes: {
                type: Number,
                default: 0
            }
        }
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Upcoming", "Ongoing", "Completed"],
        default: "Upcoming"
    }
});

const Election = mongoose.model("Election", electionSchema);
export default Election;
