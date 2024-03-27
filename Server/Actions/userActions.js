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

userActions.get('/users/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  console.log(userId);

  try {
    // Query the database to get the user by user ID
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId
      },
      select: {
        user_id: true
      }
    });

    // If user is found, return the username
    if (user) {
      res.status(200).json({ user_id: user.user_id });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

userActions.get('/assessments/:courseId', async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const assessments = await prisma.assessment.findMany({
      where: {
        course_id: courseId,
      },
      // include:{
      //   question: true,
      //   choice: true
      // }
    });
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

userActions.patch('/updateScore', async (req, res) => {
  try {
      const { userId, courseId, newScore } = req.body;

      // Check if the user is enrolled in the course
      const enrolledCourse = await prisma.enrolledCourse.findFirst({
          where: {
              user_id: userId,
              course_id: courseId,
          },
      });

      if (!enrolledCourse) {
          return res.status(404).json({ message: 'User is not enrolled in the course' });
      }

      // Update the score for the enrolled course
      const updatedEnrolledCourse = await prisma.enrolledCourse.update({
          where: {
              id: enrolledCourse.id,
          },
          data: {
              score: newScore,
          },
      });

      res.status(200).json({ message: 'Score updated successfully', updatedEnrolledCourse });
  } catch (error) {
      console.error('Error updating score:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

userActions.post('/enrolled', async (req, res) => {
  console.log(req.body);
  try {
    const { user_id, course_id,score } = req.body;

    // Validate user_id and course_id
    if (!user_id || !course_id) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }

    // Check if the user and course exist
    const user = await prisma.user.findUnique({ where: { user_id } });
    const course = await prisma.course.findUnique({ where: { course_id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await prisma.enrolledCourse.findFirst({
      where: {
        user_id,
        course_id,
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({ error: 'User is already enrolled in this course' });
    }

    // Create a new enrolled course entry
    const enrolledCourse = await prisma.enrolledCourse.create({
      data: {
        user_id,
        course_id,
        score,
      },
    });

    res.status(201).json(enrolledCourse);
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
userActions.post('/certifications', async (req, res) => {
  try {
      const { user_id, course_id, date_achieved } = req.body;

      // Create a new certification record
      const certification = await prisma.certification.create({
        data: {
          user: { connect: { user_id: user_id } }, // Connect to the user with the given user_id
          course: { connect: { course_id: course_id } }, // Connect to the course with the given course_id
          date_achieved
        }
    });

      res.status(201).json(certification); 
  } catch (error) {
      console.error('Error creating certification:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


export default userActions;