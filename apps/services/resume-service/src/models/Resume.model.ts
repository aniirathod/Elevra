import mongoose, { Schema, model, Document } from "mongoose";

// Interface defining the structure of a Resume document
export interface IResume extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Link to the User model
  title: string; // e.g., "Software Engineer Resume (Backend Focus)"
  content: any; // Flexible JSON object to store the resume structure/data
  pdfUrl?: string; // Optional: URL to the generated PDF stored in Cloudinary
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for the Resume
const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (even though it's in another service's DB context)
      required: true,
      index: true, // Index for faster lookup of resumes by user
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      default: "Untitled Resume",
    },
    content: {
      type: Schema.Types.Mixed, // Allows storing any JSON structure
      required: true,
      default: {}, // Default to an empty object
    },
    pdfUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Resume model
const Resume = model<IResume>("Resume", ResumeSchema);
export default Resume;
