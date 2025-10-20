import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // 🗳️ Reference to elections where student has voted
  hasVoted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],

  // 🖼️ Image URLs for the student's face(s)
  imageUrls: {
    type: [String],
    default: [],
  },

  // 🔢 Face embeddings generated from DeepFace
  faceEmbeddings: {
    type: [Array], // Array of embedding arrays (vectors)
    default: [],
  },

  // ✅ Whether face data is registered
  faceRegistered: {
    type: Boolean,
    default: false,
  },

  // 🕒 Timestamp for last embedding update
  embeddingUpdatedAt: {
    type: Date,
    default: null,
  },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
