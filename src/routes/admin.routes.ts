import express from 'express';
import {adminController} from '../controllers/index.ts';
import { adminAuth } from '../middleware/auth.ts';

const router = express.Router();

router.post('/login', adminController.login);

router.use(adminAuth);

router.route('/students')
    .get(adminController.getStudents)
    .post(adminController.createStudent);

router.route('/tasks')
    .get(adminController.getAlltasks)
    .post(adminController.createTask);

router.route('/task/:taskId/student/:studentId')
    .post(adminController.assignTask);

export default router;
