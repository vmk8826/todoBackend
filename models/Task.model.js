import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    completed: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}); 

const Task = mongoose.model("Task", taskSchema);

export default Task;