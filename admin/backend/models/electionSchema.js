import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    candidates: [
        {
            name: String,
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
    startTime: {
        type: String, // Format: "HH:MM AM/PM"
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    endTime: {
        type: String, // Format: "HH:MM AM/PM"
        required: true
    },

});

const Election = mongoose.model("Election", electionSchema);
export default Election;
