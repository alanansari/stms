import mongoose from "mongoose";

interface Admin {
    email: string;
    password: string;
}

const adminSchema = new mongoose.Schema<Admin>({
    email: {
        type: String,
        unique: true,
        validate: {
            validator: async function (value: string) {
                const existingAdmin = await this.constructor.findOne({ email: value });
                if (existingAdmin && existingAdmin.id !== this.id) {
                    return false;
                }
                return true;
            },
            message: 'Email address is already in use'
        }
    },
    password: String,
});

const adminModel = mongoose.model<Admin>("Admin", adminSchema);

export default adminModel;