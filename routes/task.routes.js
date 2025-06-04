import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";
import {
  createTaskList,
  getTaskLists,
  deleteTaskList,
} from "../controllers/taskList.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

//Task Routes
router.post("/createTask", authMiddleware, createTask);
router.get("/getTasks", authMiddleware, getTasks);
router.put("/updateTask", authMiddleware, updateTask);
router.delete("/deleteTask", authMiddleware, deleteTask);

//TaskList Routes
router.post("/createTaskList", authMiddleware, createTaskList);
router.get("/getTaskLists", authMiddleware, getTaskLists);
router.delete("/deleteTaskList", authMiddleware, deleteTaskList);

export default router;
