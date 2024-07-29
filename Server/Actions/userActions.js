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

userActions.put('/score', async (req, res) => {
  try {
    const { user_id, course_id, newScore } = req.body;

    if (!user_id || !course_id || value === undefined) {
      return res.status(400).json({ error: 'User ID, Course ID, and score value are required' });
    }

    const updatedScore = await prisma.score.upsert({
      where: {
        user_id_course_id: {
          user_id: user_id,
          course_id: course_id,
        },
      },
      update: {
        score: newScore,
      },
      create: {
        user_id: user_id,
        course_id: course_id,
        score: newScore,
      },
    });

    res.status(200).json(updatedScore);
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

userActions.get('/enrolled/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Fetch enrolled courses along with certification information
    const enrollment = await prisma.enrolledCourse.findMany({
      where: { user_id: userId },
      include: {
        course: true, // Include course information
        certification: true // Include certification information
      }
    });

    // Map the enrollment data to include the certification flag
    const enrollmentWithCertification = enrollment.map(enrollment => ({
      ...enrollment,
      certification: enrollment.certification?.date_achieved ? true : false
    }));

    res.status(200).json({ message: 'User enrolled', enrollment: enrollmentWithCertification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in fetching the user enrollment details' });
  }
});

userActions.post('/enrolled/:user_id/:course_id', async (req, res) => {
  const { user_id, course_id } = req.params;

  console.log('Received data:', { user_id, course_id });

  try {
    // Validate user_id and course_id
    if (!user_id || !course_id) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { user_id: parseInt(user_id, 10) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the course exists
    const course = await prisma.course.findUnique({ where: { course_id: parseInt(course_id, 10) } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await prisma.enrolledCourse.findFirst({
      where: {
        user_id: parseInt(user_id, 10),
        course_id: parseInt(course_id, 10),
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({ error: 'User is already enrolled in this course' });
    }

    // Create a new enrolled course entry
    const enrolledCourse = await prisma.enrolledCourse.create({
      data: {
        user: { connect: { user_id: parseInt(user_id, 10) } }, 
        course: { connect: { course_id: parseInt(course_id, 10) } },
        enrollmentDate: new Date(), // Use the current date
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
      if (!user_id || !course_id) {
        return res.status(400).json({ message: 'User ID and Course ID are required' });
      }
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