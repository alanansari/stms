import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import {errorMiddleware} from './middleware/errors';
import {adminRoutes, studentRoutes} from './routes';

const app = express();

app.use(express.json());
app.use(cors({origin:true}));
app.use(express.urlencoded({ extended: false }));
app.use(errorMiddleware);

app.use('/admin', adminRoutes,errorMiddleware);
app.use('/student', studentRoutes,errorMiddleware);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to Database');
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log(err);
});