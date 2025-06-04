import mongoose from "mongoose";

const taskListSchema = new mongoose.Schema({
    name: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",    
    }],
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
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

const TaskList = mongoose.model("TaskList", taskListSchema);

export default TaskList;