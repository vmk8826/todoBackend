import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dbConnection } from "./libs/dbConnection.lib.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();

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

// Add a test route to check if the server is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/v1", authRoutes);
app.use("/task/v1", taskRoutes);

dbConnection();
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
