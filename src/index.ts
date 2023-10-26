import AdminJS from 'adminjs'
import * as AdminJSExpress from '@adminjs/express'
import { dark, light, noSidebar } from '@adminjs/themes'
import MongoStore from 'connect-mongo'
import * as AdminJSMongoose from '@adminjs/mongoose'
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import {errorMiddleware} from './middleware/errors.ts';
import {adminRoutes, studentRoutes} from './routes/index.ts';
import {Admin, Student, Task} from './models/index.ts';

const app = express();

// ADMIN JS

const DEFAULT_ADMIN = {
    email: process.env.ADMIN_UNAME,
    password: process.env.ADMIN_PASS,
}
  
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      console.log("Login worked!");
      return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to Database');
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
        console.log(`AdminJS started on http://localhost:${process.env.PORT}${admin.options.rootPath}`);
    });
}).catch((err) => {
    console.log(err);
});

const sessionStore =  MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: "session",
    stringify: false,
    autoRemove: "interval",
    autoRemoveInterval: 1
});
const adminOptions = {
    resources:[Admin,Student,Task],
    rootPath:"/admin",
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
}

const admin = new AdminJS(adminOptions)
const adminRouter = AdminJSExpress.default.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  )

app.use(admin.options.rootPath, adminRouter)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin:true}));


app.use('/admins', adminRoutes,errorMiddleware);
app.use('/student', studentRoutes,errorMiddleware);
app.use(errorMiddleware);