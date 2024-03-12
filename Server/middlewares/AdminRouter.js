import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import { verifyToken } from './auth.js';

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
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).send({ status: 'fail', message: 'Invalid token' });
  }
  try {
    // console.log("verifying...");
    const decoded = await verifyToken(token)
    const{ user_id} = decoded;
    const user = await prisma.user.findFirst({ where: { user_id } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user_id = user_id;
    next()
  } catch (error) {
    console.error(error);
    res.status(401).send({ status: 'fail', message: 'Invalid token' });
  }
}

