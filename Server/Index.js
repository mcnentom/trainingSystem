import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import authRouter from './components/Auth.js'
import cors from 'cors'
import dotenv from 'dotenv'
import adminRouter from './components/Admin.js';
import { adminProtectedRoute, protectedRoute } from './middlewares/AdminRouter.js';
import adminActions from './Actions/AdminActions.js';
import userActions from './Actions/userActions.js';
import pkg from '@prisma/client'
// import socket from '../Client/tms/src/Utils/Socket.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})


dotenv.config()
const port = 3000;

app.use(cors({
    origin: " http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Secure flag for HTTPS-only
        httpOnly: true, // HttpOnly flag to prevent client-side access
        sameSite: 'none', // SameSite attribute set to strict
    }
}));


app.use('/auth', authRouter);
app.use('/admin',  adminRouter);
app.use('/adminActions', adminProtectedRoute, adminActions);
app.use('/userActions', userActions)


server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})