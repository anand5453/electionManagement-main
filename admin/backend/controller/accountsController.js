import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcryptjs";
import axios from "axios";
import Student from "../models/studentSchema.js";
import multer from "multer";
import path from "path";

export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let insertedCount = 0;
    const studentsToInsert = [];

    // ✅ Wrap the stream in a Promise so we can await it
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          const { name, rollNo, email, password, imageUrl } = row;

          if (!name || !rollNo || !email || !password) {
            console.warn("Skipping invalid row:", row);
            return;
          }

          studentsToInsert.push({ name, rollNo, email, password, imageUrl });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`✅ CSV parsed: ${studentsToInsert.length} rows`);

    for (const student of studentsToInsert) {
      try {
        const existing = await Student.findOne({ email: student.email });
        console.log("Existing check:", existing ? existing.email : "none");

        if (existing) {
          console.warn(`Skipping duplicate: ${student.email}`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(student.password, 10);

        let faceEmbedding = [];
        const absoluteImagePath = path.resolve(student.imageUrl);
        try {
          // Call Python API for embedding
          const response = await axios.post("http://localhost:5001/generate-embedding", {
            imagePath: absoluteImagePath,
          });
          faceEmbedding = response.data.embedding;
        } catch (err) {
          console.warn(`Embedding failed for ${student.email}:`, err.message);
        }

        const newStudent = new Student({
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          password: hashedPassword,
          imageUrls: [student.imageUrl],
          faceEmbeddings: [faceEmbedding],
          faceRegistered: faceEmbedding.length > 0,
          embeddingUpdatedAt: faceEmbedding.length > 0 ? new Date() : null,
        });

        await newStudent.save();
        insertedCount++;
        console.log(`✅ Saved ${student.email}`);
      } catch (err) {
        console.error("Error processing row:", err);
      }
    }

    res.status(201).json({
      message: "Student upload completed",
      insertedCount,
    });
  } catch (error) {
    console.error("Error uploading students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const upload = multer({ dest: "uploads/" });

export const deleteStudentsFromCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        let deletedCount = 0;
        let notFound = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", async (row) => {
                try {
                    if (row.email) {
                        const student = await Student.findOne({ email: row.email });

                        if (student) {
                            await Student.deleteOne({ email: row.email });
                            deletedCount++;
                        } else {
                            notFound.push(row.email);
                        }
                    }
                } catch (err) {
                    console.error("Error processing row:", err);
                }
            })
            .on("end", () => {
                res.status(200).json({
                    message: `${deletedCount} students deleted successfully.`,
                    notFound: notFound.length > 0 ? notFound : "All students found and deleted",
                });
            });

    } catch (error) {
        console.error("Error deleting students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Export multer upload middleware
export const uploadCSV = upload.single("file");
