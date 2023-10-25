import {Student, Task} from '../models';
import { ErrorHandler } from '../middleware/errors';
import jv from '../utils/student.validations'
import jwt from 'jsonwebtoken';

const studentController = {
    login: async (req: any, res: any, next: any) => {
        try{
            const body = await jv.login.validateAsync(req.body);
            console.log(body);
            const user = await Student.findOne({email: body.email},{tasks: 0});
            if(!user){
                return next(new ErrorHandler(404, "User not found"));
            }
            if(user.password !== body.password){
                return next(new ErrorHandler(401, "Invalid credentials"));
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_STUDENT_KEY, {expiresIn: '1d'});
            res.json({ success: true, message: "User logged in successfully", data: {user,token} });
        }catch(err){
            next(err)
        }
    },
    getTasks: async (req: any, res: any, next: any) => {
        try {
            
            const student = req.user;
            if(!student){
                return next(new ErrorHandler(404, "Student not found"));
            }
            const user = await Student.findById(student._id).populate('tasks.taskId');

            const tasks = user.tasks;
            
            tasks.forEach((task: any) => {
                const index = tasks.findIndex((t: any) => t.taskId === task.taskId);
                if(task.isCompleted){
                    tasks[index]._doc.status = 'completed';
                }else if(task.taskId.dueTime < Date.now()){
                    tasks[index]._doc.status = 'overdue';
                }else{
                    tasks[index]._doc.status = 'pending';
                }
            });

            res.json({ success: true, message: "Tasks fetched successfully", data: tasks });
        } catch (err) {
            next(err);
        }
    },
    changeStatus: async (req: any, res: any, next: any) => {
        try {
            const {taskId} = req.params;
            if(!taskId){
                return next(new ErrorHandler(400, "Task id is required"));
            }
            const body = await jv.changeStatus.validateAsync(req.body);

            const user = req.user;
            let userTask: typeof Task | any = null;
            let index: number = -1;

            user.tasks.forEach((task: any) => {
                if(task.taskId.toString() === taskId.toString()){
                    // get the task index
                    index = user.tasks.findIndex((t: any) => t.taskId.toString() === taskId.toString());
                    userTask = task;
                }
            });

            if(!userTask){
                return next(new ErrorHandler(400, "Task isn't assigned to user"));
            }

            if(body.status === 'completed'){
                user.tasks[index].isCompleted = true;
            }else if(body.status === 'pending'){
                user.tasks[index].isCompleted = false;
            }

            await user.save();

            res.json({ success: true, message: "Task status updated successfully"});

        } catch (err) {
            next(err);
        }
    }
};


export default studentController;