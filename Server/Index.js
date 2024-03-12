import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import http from 'http';
import { Server} from 'socket.io'; 
import authRouter from './components/Auth.js'
import cors from 'cors'
import dotenv from 'dotenv'
import adminRouter from './components/Admin.js';
import { adminProtectedRoute, protectedRoute } from './middlewares/AdminRouter.js';
import adminActions from './Actions/AdminActions.js';
import userActions from './Actions/userActions.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('io', io)
io.on('connection', (socket)=>{
    console.log("Connected");

    socket.on('disconnect', ()=>{
        console.log("Disconnected");
    })
})

dotenv.config()
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Secure flag for HTTPS-only
        httpOnly: true, // HttpOnly flag to prevent client-side access
        sameSite: 'strict', // SameSite attribute set to strict
    }
}));

app.use('/auth', authRouter);
app.use('/admin', adminProtectedRoute, adminRouter);
app.use('/adminActions', adminProtectedRoute, adminActions);
app.use('/userActions', protectedRoute, userActions)


app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})