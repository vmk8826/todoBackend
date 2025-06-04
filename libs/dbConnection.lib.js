import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    // Check for either MONGO_URI or MONGODB_URI environment variable
    const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!connectionString) {
      console.error("MongoDB connection string is not defined in environment variables");
      return;
    }
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
      connectTimeoutMS: 30000 // Increase connection timeout
    });
    
    console.log("Connected to MongoDB");
    
    // Add event listeners for connection issues
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};
