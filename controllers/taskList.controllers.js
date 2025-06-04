import User from "../models/User.model.js";
import TaskList from "../models/TaskList.model.js";

export const createTaskList = async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Name and status are required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const taskList = await TaskList.create({ name, status });

    user.tasks.push(taskList._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "TaskList created successfully",
      taskList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTaskLists = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const taskLists = await TaskList.find({ _id: { $in: user.tasks } });

    res.status(200).json({
      success: true,
      message: "TaskLists fetched successfully",
      taskLists,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteTaskList = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "TaskList ID is required" });
    }

    await TaskList.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "TaskList deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
