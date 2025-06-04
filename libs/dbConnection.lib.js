import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    // Check for either MONGO_URI or MONGODB_URI environment variable
    const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!connectionString) {
      console.error("MongoDB connection string is not defined in environment variables");
      return;
    }
    
    // Log partial connection string for debugging (hide credentials)
    const redactedUri = connectionString.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log("Connecting to MongoDB...");
    console.log(`Connection string (redacted): ${redactedUri}`);
    
    // Monitor connection process
    console.log("Step 1: Setting up MongoDB connection options");
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // Increase to 60 seconds
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      family: 4 // Force IPv4
    };
    
    // Set up event listeners first
    console.log("Step 2: Setting up MongoDB connection event listeners");
    
    mongoose.connection.on('connecting', () => {
      console.log('MongoDB connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected!');
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected!');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      if (err.name === 'MongoServerSelectionError') {
        console.error('Cannot select a MongoDB server. Possible reasons:');
        console.error('1. Network connectivity issues');
        console.error('2. MongoDB Atlas IP whitelist restrictions');
        console.error('3. Invalid credentials');
      }
    });
    
    // Attempt connection
    console.log("Step 3: Attempting MongoDB connection...");
    
    try {
      await mongoose.connect(connectionString, options);
      console.log("Step 4: MongoDB connection successful!");
    } catch (connectError) {
      console.error("Step 4: MongoDB connection failed:", connectError.message);
      console.error("Error type:", connectError.name);
      if (connectError.name === 'MongoServerSelectionError') {
        console.error('Server selection timed out. Check network connectivity and whitelist settings.');
      } else if (connectError.name === 'MongoNetworkError') {
        console.error('Network error occurred. Check if MongoDB service is running.');
      } else if (connectError.name === 'MongoParseError') {
        console.error('Connection string parse error. Check your MongoDB URI format.');
      }
      throw connectError; // Rethrow to handle it upstream
    }
    
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Full error:", error);
    throw error; // Propagate the error
  }
};
