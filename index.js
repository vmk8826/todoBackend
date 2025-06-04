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
        process.env.FRONTEND_URL
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

app.use("/api/v1", authRoutes);
app.use("/task/v1", taskRoutes);

dbConnection();
app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
  res.status(200).json({ message: "Server is running" });
});
