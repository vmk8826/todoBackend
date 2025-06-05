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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Root route - always available
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/v1", authRoutes);
app.use("/task/v1", taskRoutes);

dbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
