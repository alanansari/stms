import express from 'express';
import {studentController} from '../controllers/index.ts';
import { studentAuth } from '../middleware/auth.ts';

const router = express.Router();

router.post('/login', studentController.login);

router.use(studentAuth);

router.get('/tasks',studentController.getTasks);
router.patch('/task/:taskId',studentController.changeStatus);

export default router;