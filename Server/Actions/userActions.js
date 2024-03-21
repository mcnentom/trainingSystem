import pkg from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { protectedRoute } from '../middlewares/AdminRouter.js';
// import { io } from '../Index.js';

dotenv.config();

const secret_key = process.env.SECRET_KEY
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const userActions = express.Router();

//Get discussions
// userActions.get('/discussions', async(req, res)=>{
//   try {
//     const discussions = await prisma.discussion.findMany();
//     res.json(discussions)
//   } catch (error) {
//     console.error("Error fetching discussion:", error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// })

userActions.route('/discussions').get(async (req, res) => {
  try {
    const discussions = await prisma.discussion.findMany({
      include: {
        user: {
            select: {
                profile_image: true
            }
        }
    }
    });
    res.json(discussions)
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//post a discussion
userActions.route("/discussions").post(protectedRoute, async (req, res) => {
    try {
      const { content } = req.body;
      const{ email }= req.session.user;
      console.log('Email ', email);
      // Create the discussion and connect it to the user
      const newDisc = await prisma.discussion.create({
        data: {
          content,
          user: {
            connect: { email }
          }
        }
      });

      res.status(201).json({ status: 'success', discussion: newDisc });
    } catch (error) {
      console.error('Error creating discussion:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

userActions.delete('/discussions/:discussion_id ', async(req,res) => {
 
  const{   discussion_id  } = req.params;
  try {
    // const existingDiscussion= await prisma.discussion.findFirst({
    //   where: {  discussion_id :parseInt(  discussion_id )}
    // })
    // if(!existingDiscussion){
    //   return response.status(404).json({ message: "Discussion not found"})
    // }
    await prisma.delete({
      where: {  discussion_id :parseInt(  discussion_id )}
    })
    res.status(200).json({ message: "Discussion deleted successfully"})
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

export default userActions;