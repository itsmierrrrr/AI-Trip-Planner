import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    // TODO: Replace with your MongoDB Atlas connection string in .env
    await mongoose.connect(env.mongodbUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
