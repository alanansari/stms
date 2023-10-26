import jwt from 'jsonwebtoken';
import { ErrorHandler } from './errors.ts';
import { Admin,Student } from '../models/index.ts';

const adminAuth = async (req: any, res: any, next: any) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ','');
        if (!token) return next(new ErrorHandler(401, "Please Login or Signup"));
        jwt.verify(token, process.env.JWT_ADMIN_KEY, async (err:any, payload:any) => {
            if (err) {
              return next(new ErrorHandler(401, "Invalid Authentication"));
            }
            const { id } = payload;
            const user = await Admin.findById(id);
            if (!user) next(new ErrorHandler(401, "Invalid Authentication"));
            req.user = user;
            next();
          });
    }catch(err){
        return next(err);
    }
}

const studentAuth = async (req: any, res: any, next: any) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ','');
        if (!token) return next(new ErrorHandler(401, "Please Login or Signup"));
        jwt.verify(token, process.env.JWT_STUDENT_KEY, async (err:any, payload:any) => {
            if (err) {
              return next(new ErrorHandler(401, "Invalid Authentication"));
            }
            const { id } = payload;
            const user = await Student.findById(id);
            if (!user) next(new ErrorHandler(401, "Invalid Authentication"));
            req.user = user;
            next();
          });
    }catch(err){
        return next(err);
    }
}

export {
    adminAuth,
    studentAuth
}