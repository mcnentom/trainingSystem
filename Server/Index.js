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
	  methods: ["GET", "POST"],
	},
  });
  
  io.on("connection", async (socket) => {
	console.log(`User Connected: ${socket.id}`);
  
	socket.on("join_room", async (data) => {
	  socket.join(data);
	  console.log(`User with ID: ${socket.id} joined room: ${data}`);
  
	  // Fetch and emit previous messages from the database
	  const storedMessages = await prisma.message.findMany({
		where: {
		  room: data,
		},
	  });
  
	  storedMessages.forEach((message) => {
		socket.emit("receive_message", message); // Emit to the current socket
	  });
	});
  
	socket.on("send_message", async (data) => {
	  // Emit the received message event to all sockets in the room except the sender
	  io.to(data.room).emit("receive_message", data);
  
	  // Store messages in the database
	  await prisma.message.create({
		data: {
		  room: data.room,
		  author: data.author,
		  message: data.message,
		  time: data.time,
		},
	  });
	});
  
	socket.on("disconnect", () => {
	  console.log("User Disconnected", socket.id);
	});
  });
  
dotenv.config()
const port = 3000;

app.use(cors({
    origin: " http://localhost:5173",
    methods: ["GET", "POST","DELETE","PATCH"],
    credentials: true
}));
// app.options('*', cors()); 
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