import Task from "../models/Task.model.js";
import TaskList from "../models/TaskList.model.js";

export const createTask = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Name and description are required" });
    }

    const taskList = await TaskList.findById(req.query.id);

    if (!taskList) {
      return res
        .status(404)
        .json({ success: false, message: "Task list not found" });
    }

    const task = await Task.create({ name, description });

    taskList.tasks.push(task._id);

    await taskList.save();

    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const taskList = await TaskList.findById(req.query.id);

    if (!taskList) {
      return res
        .status(404)
        .json({ success: false, message: "Task list not found" });
    }

    const tasks = await Task.find({ _id: { $in: taskList.tasks } });

    res
      .status(200)
      .json({ success: true, message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Task ID is required" });
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Name and description are required" });
    }

    const task = await Task.findByIdAndUpdate(id, { name, description });

    res
      .status(200)
      .json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Task ID is required" });
    }

    await Task.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
