import mongoose from "mongoose";

interface Admin {
    email: string;
    password: string;
}

const adminSchema = new mongoose.Schema<Admin>({
    email: {
        type: String,
        unique: true,
    },
    password: String,
});

const adminModel = mongoose.model<Admin>("Admin", adminSchema);

export default adminModel;