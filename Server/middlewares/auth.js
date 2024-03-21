import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const SECRET_KEY = process.env.SECRET_KEY
 const generateToken =  ( userId,email, userType) =>{
    const payload = {
        userId: userId,
        email: email,
        userType
    }
     // set expiration
     const expiresIn = '1h'
     //sign in the token
     return jwt.sign( payload, SECRET_KEY, { expiresIn});
 }

 const verifyToken  = (token) =>{
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to verify")
    }
 }

 const generateHashedPassword = async(password)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(password, salt);
        return HashedPassword;
    } catch (error) {
        console.error(error);
        throw error;
    }
 }
  const comparePassword = async(password, HashedPassword)=>{
    try {
        return await bcrypt.compare(password,HashedPassword)
    } catch (error) {
       console.error(error);
       throw error; 
    }
  }

   export { generateHashedPassword, verifyToken, generateToken, comparePassword }

