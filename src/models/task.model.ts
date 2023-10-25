import mongoose from "mongoose";

interface Task {
    name: string;
    description: string;
    dueTime: Date;
}

const taskSchema = new mongoose.Schema<Task>({
    name: String,
    description: String,
    dueTime: Date,
});

const taskModel = mongoose.model<Task>("Task", taskSchema);

export default taskModel;