import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(mongoUri);

    if (!mongoUri) {
      console.error("FATAL ERROR: MONGO_URI is not defined in the .env file");
      process.exit(1); // Exit process with failure
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully to Auth Service DB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
