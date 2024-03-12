import pkg from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken'



const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const userActions = express.Router();

//Get discussions
userActions.get('/discussions', async(req, res)=>{
  try {
    const discussions = await prisma.discussion.findMany();
    res.json(discussions)
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//post a discussion
userActions.post("/discussions", async( req,res)=>{
  const { content, user_id} = req.body;
  try {
    const discussion = await prisma.discussion.create({
      data: { content, user_id: parseInt(user_id)}
    })
    req.app.get('io').emit('discussion:new', discussion); 
    res.status(201).json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({error: 'internal server errror'})
  }
})
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