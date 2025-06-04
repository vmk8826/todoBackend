import mongoose from "mongoose";

// Cache the database connection
let isConnected = false;

export const dbConnection = async () => {
  try {
    // If already connected, return
    if (isConnected) {
      console.log("Using existing database connection");
      return;
    }

    // Check for connection string
    const MONGODB_URI = process.env.MONGO_URI;
    
    if (!MONGODB_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    
    console.log("Connecting to MongoDB...");
    
    // Very simple connection options - minimal to avoid issues
    const conn = await mongoose.connect(MONGODB_URI);
    
    isConnected = true;
    console.log("MongoDB connected successfully");
    
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};
