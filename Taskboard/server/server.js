import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import taskRouter from './routes/task.route.js';

import { errorHandler } from './libs/middleware.js';
import fileUpload from 'express-fileupload';
import cldRouter from './routes/cloudinary.route.js';

const PORT = 8000;
const app = express();

app.use(express.json());

app.get('/',(req,res)=> {
  res.status(200).json({message:'Hello from Server'});
})
app.use(cookieParser());
app.use(fileUpload());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true,
  })
);

app.use('/api/v1/users', userRouter); // use => middleware => request -> middleware -> response 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/image',cldRouter);
app.use('/api/v1/tasks',taskRouter);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'not found' });
});

app.use(errorHandler); // next middleware

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
 

// http://localhost:8000/api/v1/auth/signin => http://localhost => server , 8000=> port, api/v1/auth => URI prefix , signin => actual URI
// server+port+URI prefix=>Base URL