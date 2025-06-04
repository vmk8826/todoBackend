import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskList",
    }],
});

const User = mongoose.model("User", userSchema);

export default User;