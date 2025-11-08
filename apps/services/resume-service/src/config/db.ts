import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error(
        "FATAL ERROR: MONGO_URI is not defined in the .env file in Resume service"
      );
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    // Update the log message for clarity
    console.log("✅ MongoDB connected successfully to Resume Service DB");
  } catch (error) {
    console.error("❌ MongoDB connection error:: Resume Service ::", error);
    process.exit(1);
  }
};

export default connectDB;
