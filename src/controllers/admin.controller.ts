import { Admin,Student,Task } from "../models/index";
import { ErrorHandler } from "../middleware/errors";
import jwt from "jsonwebtoken";
import jv from "../utils/admin.validations";

const adminController = {
    login: async (req: any, res: any, next: any) => {
        try{
            const body = await jv.login.validateAsync(req.body);
            console.log(body);
            const user = await Admin.findOne({email: body.email});
            if(!user){
                return next(new ErrorHandler(404, "User not found"));
            }
            if(user.password !== body.password){
                return next(new ErrorHandler(401, "Invalid credentials"));
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_ADMIN_KEY, {expiresIn: '1d'});
            res.json({ success: true, message: "Admin Logged in successfully", data: {user,token} });
        }catch(err){
            next(err)
        }
    },
    createStudent: async (req: any, res: any, next: any) => {
        try{
            const body = await jv.createStudent.validateAsync(req.body);
            console.log(body);
            const user = await Student.create(body);
            res.status(201).json({ success: true, message: "Student created successfully", data: user });
        }catch(err){
            next(err)
        }
    },
    getStudents: async (req: any, res: any, next: any) => {
        try{
            const users = await Student.find({}, {tasks: 0});
            res.json({ success: true, message: "Students fetched successfully", data: users });
        }catch(err){
            next(err)
        }
    },
    createTask: async (req: any, res: any, next: any) => {
        try{
            const body = await jv.createTask.validateAsync(req.body);
            console.log(body);
            const task = await Task.create(body);
            res.status(201).json({ success: true, message: "Task created successfully", data: task });
        }catch(err){
            next(err)
        }
    },
    getAlltasks: async (req: any, res: any, next: any) => {
        try{
            const tasks = await Task.find();
            res.json({ success: true, message: "Tasks fetched successfully", data: tasks });
        }catch(err){
            next(err)
        }
    },
    assignTask: async (req: any, res: any, next: any) => {
        try{
            const {studentId,taskId} = req.params;
            const student = await Student.findById(studentId);
            if(!student){
                return next(new ErrorHandler(404, "Student not found"));
            }
            const task = await Task.findById(taskId);
            if(!task){
                return next(new ErrorHandler(404, "Task not found"));
            }
            // check if task is already assigned to student
            const isAssigned = student.tasks.find((task: any) => task.taskId.toString() === taskId.toString());
            if(isAssigned){
                return next(new ErrorHandler(400, "Task is already assigned to student"));
            }
            student.tasks.push({
                taskId: taskId,
                isCompleted: false
            });
            await student.save();
            res.status(201).json({ success: true, message: "Task assigned successfully" });
        }catch(err){
            next(err)
        }
    },
    getStudentTasks: async (req: any, res: any, next: any) => {
        try {
            const {studentId} = req.params;
            const student = await Student.findById(studentId);
            if(!student){
                return next(new ErrorHandler(404, "Student not found"));
            }
            const tasks = student.tasks;
            tasks.forEach((task: any) => {
                const index = tasks.findIndex((t: any) => t.taskId === task.taskId);
                if(task.dueTime < Date.now()){
                    tasks[index]._doc.status = 'overdue';
                }else if(task.isCompleted){
                    tasks[index]._doc.status = 'completed';
                }else{
                    tasks[index]._doc.status = 'pending';
                }
            });
            res.json({ success: true, message: "Tasks fetched successfully for student", data: {student,tasks} });
        } catch (err) {
            next(err);
        }
    }
}

export default adminController
