import {Router} from 'express'
import pkg2 from 'express-validator';
import pkg from '@prisma/client';
import loginSchema from '../Validations/LoginSchema.js';
import registerSchema from '../Validations/RegisterSchema.js';
import { generateHashedPassword, generateToken, comparePassword  } from '../middlewares/auth.js';

const {PrismaClient} = pkg;
const { validationResult, checkSchema} = pkg2;
const prisma = new PrismaClient()

const AuthRouter = Router();

AuthRouter.post('/register',checkSchema(registerSchema), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).send({ status: "fail", errors})
    }
    const { username, email, password } = req.body;
  
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
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword
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
    const token = generateToken( user.id);
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