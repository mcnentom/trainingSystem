import pkg from '@prisma/client';
import express from 'express';


const{PrismaClient} = pkg;
const prisma = new PrismaClient();

const adminActions = express.Router();


//users table
// Get all users
adminActions.get('/user', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create a new user
adminActions.post('/user', async (req, res) => {
  const newUser = req.body;
  const user = await prisma.user.create({
    data: newUser
  });
  res.json(user);
});

//updating a user
adminActions.put('/user/:user_id', async(req,res)=>{
    const { user_id} = req.params;
    const { newDetails } = req.body;

    try {
        const updated = await prisma.user.update({
            where: { id: parseInt(user_id) },
            data: {  newDetails }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error modifying score:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

adminActions.delete('/user/user_id', async(req,res)=>{
    const { user_id } = req.params;

    try {
        // Delete the user
        await prisma.user.delete({
            where: { user_id: parseInt(user_id) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

adminActions.patch('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { username, email } = req.body;

    try {
        // Update the specified fields of the user
        const updatedUser = await prisma.user.update({
            where: { user_id: parseInt(user_id) },
            data: { username, email }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//courses table
adminActions.get('/courses', async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json(courses);
});

// Create a new course
adminActions.post('/courses', async (req, res) => {
  const newCourse = req.body;
  const course = await prisma.course.create({
    data: newCourse
  });
  res.json(course);
});
adminActions.put('/courses/: course_id', async(req,res)=>{
    const {  course_id } = req.params;
    const { newDetails } = req.body;

    try {
        const updated = await prisma.course.update({
            where: { id: parseInt( course_id ) },
            data: {  newDetails }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error modifying score:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
adminActions.delete('/courses/: course_id', async(req,res)=>{
    const { course_id } = req.params;

    try {
        // Delete the user
        await prisma.user.delete({
            where: { user_id: parseInt(course_id) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
adminActions.patch('/courses/: course_id', async (req, res) => {
    const { course_id } = req.params;
    const {course_name , instructor ,duration  } = req.body;

    try {
        // Update the specified fields of the user
        const updatedUser = await prisma.user.update({
            where: { user_id: parseInt(course_id) },
            data: {course_name , instructor ,duration }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//certificates table

adminActions.get('/certification', async (req, res) => {
    const cert = await prisma.certification.findMany();
    res.json(cert);
  });


//assessment table
adminActions.get('/assessment', async (req, res) => {
    const data = await prisma.user_assessment.findMany();
    res.json(data);
});

adminActions.delete('/assessment/:assessment_id', async(req,res)=>{
    const { assessment_id} = req.params;
    try {
        // Delete the user
        await prisma.User_Assessment.delete({
            where: { user_id: parseInt(assessment_id) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
adminActions.patch('/assessment/:assessment_id ', async (req, res) => {
    const { assessment_id} = req.params;
    const { score} = req.body;

    try {
        // Update the specified fields of the user
        const updatedUser = await prisma.User_Assessment.update({
            where: { user_id: parseInt(assessment_id) },
            data: { score }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//discussion table
adminActions.get('/discussion', async (req, res) => {
    const newdata = await prisma.Discussion.findMany();
    res.json(newdata);
  });

adminActions.post('/discussion', async (req, res) => {
    const data = req.body;
    const newdata = await prisma.Discussion.create({
      data: data
    });
    res.json(newdata);
  });

adminActions.delete('/discussion/:discussion_id', async(req,res)=>{
    const { discussion_id} = req.params;
    try {
        // Delete the user
        await prisma.Discussion.delete({
            where: { user_id: parseInt(discussion_id) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

adminActions.patch('/discussion/:discussion_id', async (req, res) => {
    const { discussion_id} = req.params;
    const { content} = req.body;

    try {
        // Update the specified fields of the user
        const updated = await prisma.Discussion.update({
            where: { user_id: parseInt(discussion_id) },
            data: { content }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//coursematerial table
adminActions.get('/coursematerial', async (req, res) => {
    const data = await prisma.CourseMaterial.findMany();
    res.json(data);
  });

  adminActions.post('/coursematerial', async (req, res) => {
    const data = req.body;
    const newdata = await prisma.CourseMaterial.create({
      data: data
    });
    res.json(newdata);
  });
  
  adminActions.put('/coursematerial/:material_id', async(req,res)=>{
      const { material_id } = req.params;
      const { newDetails } = req.body;
  
      try {
          const updated = await prisma.CourseMaterial.update({
              where: { id: parseInt(material_id  ) },
              data: {  newDetails }
          });
          res.json(updated);
      } catch (error) {
          console.error('Error modifying score:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  })
  
  adminActions.delete('/coursematerial/:material_id', async(req,res)=>{
      const { material_id} = req.params;
  
      try {
          // Delete the user
          await prisma.CourseMaterial.delete({
              where: { material_id: parseInt(material_id) }
          });
  
          res.json({ message: 'User deleted successfully' });
      } catch (error) {
          console.error('Error deleting user:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  })
  
  adminActions.patch('/coursematerial/:material_id', async (req, res) => {
      const { material_id } = req.params;
      const { material_url,  material_type } = req.body;
  
      try {
          // Update the specified fields of the user
          const updated = await prisma.CourseMaterial.update({
              where: { material_id: parseInt(material_id) },
              data: { material_url,  material_type }
          });
  
          res.json(updated);
      } catch (error) {
          console.error('Error updating user:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });
 
  
//CourseEnrollment table
  adminActions.get('/courseenrolment', async (req, res) => {
    const courses = await prisma.courseenrollment.findMany();
    res.json(courses);
  });

  adminActions.patch('/courseenrolment/:enrollment_id ', async (req, res) => {
    const { enrollment_id  } = req.params;
    const { progress} = req.body;

    try {
        // Update the specified fields of the user
        const updated = await prisma.CourseEnrollment.update({
            where: { enrollment_id  : parseInt(enrollment_id  ) },
            data: { progress }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default adminActions;


