import pkg from '@prisma/client';
import { verifyToken } from './auth.js';
import dotenv from 'dotenv'

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

dotenv.config();

export const adminProtectedRoute = async (req, res, next) => {
  try {
   
    const userEmail = req.user && req.user.email;

    
    const isAdmin = await prisma.admin.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (isAdmin) {
      next(); 
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export async function protectedRoute(req, res, next) {
  console.log('protected route req.session.user', req.session.user);
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).send({ status: 'fail', message: 'Invalid token' });
  }
  try {
    // console.log("verifying...");
    const decoded = await verifyToken(token)
    const{ user_id, email} = decoded;
    const user = await prisma.user.findFirst({ where: { user_id, email } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if(!req.session.user) {
      req.session.user = user
    }

    req.user_id = user_id;
    req.email = email;
    next()
  } catch (error) {
    console.error(error);
    res.status(401).send({ status: 'fail', message: 'Invalid token' });
  }
}
export const authMiddleware = async (req, res, next) => {
  // Check if the authorization header is present
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Token missing' });
  }

  try {
      // Verify the token and extract user information
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded; // Attach user information to the request object

      // Fetch the user from the database using the decoded information
      const user = await prisma.user.findUnique({
          where: {
              email: decoded.email // Assuming email is stored in the token payload
          }
      });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Attach the user to the request object
      req.user = user;

      // Continue to the next middleware
      next();
  } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(403).json({ message: 'Invalid token' });
  }
};
