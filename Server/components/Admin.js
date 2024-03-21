import express from 'express';
import pkg2 from 'express-validator';
import pkg from '@prisma/client';
import { generateHashedPassword, generateToken, comparePassword } from '../middlewares/auth.js';
import loginSchema from '../Validations/LoginSchema.js';
import { adminProtectedRoute } from '../middlewares/AdminRouter.js';
import registerSchema from '../Validations/RegisterSchema.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const { validationResult, checkSchema } = pkg2;
const adminRouter = express.Router();

// Route for registering a new admin
adminRouter.post('/register', checkSchema(registerSchema), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({ status: "fail", errors })
    }
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    const existingAdmin = await prisma.admin.findFirst({
        where: {
            email
        }
    });

    if (existingAdmin) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await generateHashedPassword(password);
    try {
        // Create the new admin
        const newAdmin = await prisma.admin.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'Admin registered successfully', newAdmin });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for logging in an admin
// adminRouter.post('/login', checkSchema(loginSchema),adminProtectedRoute, async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(400).send({ status: "fail", errors })
//     }
//     const { email, password } = req.body;

//     // Find the admin by email
//     const admin = await prisma.admin.findFirst({
//         where: {
//             email
//         }
//     });

//     if (!admin) {
//         return res.status(404).json({ message: 'Admin not found' });
//     }

//     // Check if the password is correct
//     const passwordMatch = await comparePassword(password, admin.password);

//     if (!passwordMatch) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = generateToken(admin.id)
//     req.session.admin = admin;
//     res.cookie('auth_token', token);
//     res.status(200).json({ message: 'Admin logged in successfully', token });
// });

export default adminRouter;
