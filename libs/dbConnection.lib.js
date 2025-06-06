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
    
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI);
    
    isConnected = true;
    console.log("MongoDB connected successfully");
    
    // Add disconnect handler
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};
