import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dbConnection } from "./libs/dbConnection.lib.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verify environment variables
console.log("Starting server with environment variables:");
console.log("- NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("- PORT:", process.env.PORT || "not set (using default 3000)");
console.log("- MONGO_URI:", process.env.MONGO_URI ? "set" : "not set");
console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "set" : "not set");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "set" : "not set");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if(!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3001',
        'https://localhost:3001',
        process.env.FRONTEND_URL,
        'https://todo-app-frontend.vercel.app',  // Add your frontend URL here
        'https://task-app-frontend.vercel.app'
      ].filter(Boolean);
      
      if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Root route - always available
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  }[dbStatus] || "unknown";

  res.status(200).json({ 
    status: "healthy",
    database: dbStatusText,
    environment: process.env.NODE_ENV || "development"
  });
});

// Debug endpoint - Check MongoDB environment variables
app.get("/api/debug", (req, res) => {
  res.status(200).json({
    mongoEnv: {
      hasMongoUri: !!process.env.MONGO_URI,
      hasMongodbUri: !!process.env.MONGODB_URI,
    },
    serverTime: new Date().toISOString()
  });
});

app.use("/api/v1", authRoutes);
app.use("/task/v1", taskRoutes);

dbConnection();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
