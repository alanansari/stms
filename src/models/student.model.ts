import mongoose from 'mongoose';

interface Student {
    name: string;
    email: string;
    department: string;
    password: string;
    tasks: [{
        [x: string]: any;
        taskId: string;
        isCompleted: boolean;
    }];
}

const studentSchema = new mongoose.Schema<Student>({
    name: String,
    email: {
        type: String, 
        unique: true,
        validate: {
            validator: async function (value: string) {
                const existingStudent = await this.constructor.findOne({ email: value });
                if (existingStudent && existingStudent.id !== this.id) {
                    return false;
                }
                return true;
            },
            message: 'Email address is already in use'
        }
    },
    department: String,
    password: String,
    tasks:[{
        taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
        isCompleted: {type: Boolean, default: false}
    }]
});

const studentModel = mongoose.model<Student>('Student', studentSchema);

export default studentModel;
