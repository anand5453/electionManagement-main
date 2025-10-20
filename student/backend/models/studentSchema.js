import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Election" }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  imageUrls: {
    type: [String], // Array of image URLs (e.g., stored in /uploads or Cloud)
    default: [],
  },

  faceEmbeddings: {
    type: [[Number]], // Array of embedding arrays (128D or 512D)
    default: [],
  },

  faceRegistered: {
    type: Boolean,
    default: false,
  },

  embeddingUpdatedAt: {
    type: Date,
    default: null,
  },

});

const Student = mongoose.model("Student", studentSchema);
export default Student;
