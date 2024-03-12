import {Router} from 'express'
import pkg2 from 'express-validator';
import pkg from '@prisma/client';
import loginSchema from '../Validations/LoginSchema.js';
import registerSchema from '../Validations/RegisterSchema.js';
import { createCanvas } from 'canvas'; 
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'
import { generateHashedPassword, generateToken, comparePassword  } from '../middlewares/auth.js';

const {PrismaClient} = pkg;
const { validationResult, checkSchema} = pkg2;
const prisma = new PrismaClient()
const upload = multer({ dest: 'uploads/' }); 
const AuthRouter = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

AuthRouter.post('/register', upload.single('profile_image'), checkSchema(registerSchema), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).send({ status: "fail", errors})
    }
    const { username, email, password, profile_image } = req.body;
  
    // Check if username or email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
          email : email
      }
    });
  
    if (existingUser) {
      return res.status(400).json({ message: "Email  already exists" });
    }
  
    // Hash the password
    const hashedPassword = await generateHashedPassword(password);
  
    try {

      let profileImagePath = null;

      if (req.file) {
          // If a file is uploaded, save its path
          profileImagePath = req.file.path;
      } else {
          // If no file is uploaded, generate initials from the username
          const initials = username.split(' ').map(name => name[0]).join('').toUpperCase();
          const canvas = createCanvas(100, 100);
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'lightgrey';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'black';
          ctx.font = '48px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
          const buffer = canvas.toBuffer();
          const timestamp = Date.now();
          const filename = `initials_${timestamp}.png`;
          const filepath = join(__dirname, 'uploads', filename);
          await fs.promises.mkdir(join(__dirname, 'uploads'), { recursive: true });
          await fs.promises.writeFile(filepath, buffer);
          profileImagePath = filepath;
      }

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          profile_image: profileImagePath
        }
      });
      res.status(201).json({ message: "User registered successfully"});
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Login route
  AuthRouter.post('/login', checkSchema(loginSchema), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).send({ status: "fail", errors})
    }
    const { email, password } = req.body;
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Check if the password is correct
    const passwordMatch = await comparePassword(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user.id);
    req.session.user = user;
    res.cookie('auth_token', token);
    res.status(201).json({ status: 'success', token });
  });

  AuthRouter.get("/logout", async (req, res) => {
    // clear the auth_token cookie
    // retrive token, verify the token 
    res.clearCookie("auth_token");
    res.send({status: "success", message: "user logged out"}).end()
})

export default AuthRouter;