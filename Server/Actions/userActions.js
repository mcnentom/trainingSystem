import pkg from '@prisma/client';
import express from 'express';
import dotenv from 'dotenv';


dotenv.config();


const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const userActions = express.Router();

userActions.get('/courses/:courseId', async (req, res) => {
  try {
      const courseId = parseInt(req.params.courseId);

      // Fetch course details with material batches
      const courseDetails = await prisma.course.findUnique({
          where: { course_id: courseId },
          include: {
              materialBatches: true
          }
      });

      if (!courseDetails) {
          return res.status(404).json({ error: 'Course not found' });
      }

      res.json(courseDetails);
  } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
userActions.get('/courses', async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        select: {
          course_id: true,
          course_name: true
        }
      });
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default userActions;