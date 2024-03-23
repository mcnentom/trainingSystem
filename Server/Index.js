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
const io = new Server(8000, {
	cors: true,
  });
  
  const emailToSocketIdMap = new Map();
  const socketidToEmailMap = new Map();
  
  io.on("connection", (socket) => {
	console.log(`Socket Connected`, socket.id);
	socket.on("room:join", (data) => {
	  const { email, room } = data;
	  emailToSocketIdMap.set(email, socket.id);
	  socketidToEmailMap.set(socket.id, email);
	  io.to(room).emit("user:joined", { email, id: socket.id });
	  socket.join(room);
	  io.to(socket.id).emit("room:join", data);
	});
  
	socket.on("user:call", ({ to, offer }) => {
	  io.to(to).emit("incomming:call", { from: socket.id, offer });
	});
  
	socket.on("call:accepted", ({ to, ans }) => {
	  io.to(to).emit("call:accepted", { from: socket.id, ans });
	});
  
	socket.on("peer:nego:needed", ({ to, offer }) => {
	  console.log("peer:nego:needed", offer);
	  io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
	});
  
	socket.on("peer:nego:done", ({ to, ans }) => {
	  console.log("peer:nego:done", ans);
	  io.to(to).emit("peer:nego:final", { from: socket.id, ans });
	});
  });

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