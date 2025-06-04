// Run with: node mongodb-test.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoConnection() {
  console.log('Starting MongoDB connection test...');
  
  const MONGO_URI = process.env.MONGO_URI;
  
  if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }
  
  console.log('Attempting to connect to MongoDB...');
  
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Collections in database: ${collections.map(c => c.name).join(', ')}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message
    });
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not select a MongoDB server. Possible causes:');
      console.error('1. Network connectivity issues - verify your IP whitelist includes 0.0.0.0/0');
      console.error('2. Invalid connection string or credentials');
      console.error('3. MongoDB Atlas cluster might be paused or unavailable');
    }
  } finally {
    process.exit(0);
  }
}

testMongoConnection(); 