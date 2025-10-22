// Script to fix empty embeddings in the database
// Run this with: node fix_embeddings.js

import mongoose from "mongoose";
import Student from "./models/studentSchema.js";
import dotenv from "dotenv";

dotenv.config();

const fixEmbeddings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/electionManagement");
    console.log("✅ Connected to MongoDB");

    // Find all students with empty embeddings
    const studentsWithEmptyEmbeddings = await Student.find({
      $or: [
        { faceEmbeddings: { $size: 0 } }, // Empty array
        { faceEmbeddings: [[]] }, // Array containing empty array
        { "faceEmbeddings.0": { $size: 0 } } // First embedding is empty
      ]
    });

    console.log(`Found ${studentsWithEmptyEmbeddings.length} students with empty embeddings`);

    // Fix each student
    for (const student of studentsWithEmptyEmbeddings) {
      console.log(`Fixing student: ${student.email}`);
      
      // Clear the face embeddings and reset face registration status
      await Student.updateOne(
        { _id: student._id },
        {
          $set: {
            faceEmbeddings: [],
            faceRegistered: false,
            embeddingUpdatedAt: null
          }
        }
      );
      
      console.log(`✅ Fixed ${student.email}`);
    }

    console.log("🎉 All empty embeddings have been fixed!");
    
    // Show summary
    const totalStudents = await Student.countDocuments();
    const studentsWithValidEmbeddings = await Student.countDocuments({
      faceEmbeddings: { $exists: true, $not: { $size: 0 } },
      "faceEmbeddings.0": { $exists: true, $not: { $size: 0 } }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`Total students: ${totalStudents}`);
    console.log(`Students with valid embeddings: ${studentsWithValidEmbeddings}`);
    console.log(`Students without embeddings: ${totalStudents - studentsWithValidEmbeddings}`);

  } catch (error) {
    console.error("❌ Error fixing embeddings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

fixEmbeddings();
