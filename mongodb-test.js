// Run with: node mongodb-test.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function testMongoConnection(returnResult = false) {
  console.log('Starting MongoDB connection test...');
  
  const result = {
    success: false,
    logs: [],
    collections: [],
    error: null
  };
  
  function log(message) {
    console.log(message);
    result.logs.push(message);
  }
  
  function logError(message) {
    console.error(message);
    result.logs.push(`ERROR: ${message}`);
  }
  
  const MONGO_URI = process.env.MONGO_URI;
  
  if (!MONGO_URI) {
    logError('MONGO_URI environment variable is not set');
    result.error = 'MONGO_URI not set';
    
    if (returnResult) return result;
    process.exit(1);
  }
  
  log('Attempting to connect to MongoDB...');
  
  try {
    // Force a new connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      log('Closed existing connection');
    }
    
    const conn = await mongoose.connect(MONGO_URI);
    log('✅ Connected to MongoDB successfully!');
    result.success = true;
    
    // Test a simple query
    try {
      log('Testing listCollections query...');
      const collections = await mongoose.connection.db.listCollections().toArray();
      log(`Collections in database: ${collections.map(c => c.name).join(', ')}`);
      result.collections = collections.map(c => c.name);
    } catch (queryError) {
      logError(`Query failed: ${queryError.message}`);
      result.error = `Connected but query failed: ${queryError.message}`;
    }
    
    // Close connection
    await mongoose.connection.close();
    log('Connection closed');
    
  } catch (error) {
    logError(`❌ Failed to connect to MongoDB: ${error.message}`);
    
    const errorDetails = {
      name: error.name,
      code: error.code,
      message: error.message
    };
    
    logError(`Error details: ${JSON.stringify(errorDetails)}`);
    result.error = error.message;
    
    if (error.name === 'MongoServerSelectionError') {
      logError('Could not select a MongoDB server. Possible causes:');
      logError('1. Network connectivity issues - verify your IP whitelist includes 0.0.0.0/0');
      logError('2. Invalid connection string or credentials');
      logError('3. MongoDB Atlas cluster might be paused or unavailable');
    }
  }
  
  if (returnResult) {
    return result;
  } else {
    process.exit(result.success ? 0 : 1);
  }
}

// If run directly (not imported)
if (import.meta.url === process.argv[1]) {
  testMongoConnection();
} 