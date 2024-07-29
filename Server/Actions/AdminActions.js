import {Router} from 'express'
import pkg2 from 'express-validator';
import pkg from '@prisma/client';
import registerSchema from '../Validations/RegisterSchema.js';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
import multer from 'multer';
import { generateHashedPassword, generateToken, comparePassword  } from '../middlewares/auth.js';

const {PrismaClient} = pkg;
const { validationResult, checkSchema} = pkg2;
const prisma = new PrismaClient()
const upload = multer({ dest: 'uploads/' }); 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const adminActions = Router();

adminActions.get('/users', async (req, res) => {
    try {
        // Fetch all users with their enrolled courses and other required details
        const allUsers = await prisma.user.findMany({
            select: {
                user_id: true, // We need the user_id to check enrolled courses
                username: true,
                email: true,
                enrolledCourses: {
                    select: {
                        id: true // Just need the ID to check existence
                    }
                },
                taught_courses: {
                    select: {
                        course_name: true,
                        duration: true,
                        progress: true
                    }
                },
                certifications: {
                    select: {
                        date_achieved: true
                    }
                }
            }
        });

        // Post-process to filter and format the response based on enrollment
        const userDetails = allUsers.map(user => {
            if (user.enrolledCourses.length > 0) {
                // User is enrolled in at least one course
                return {
                    username: user.username,
                    email: user.email,
                    taught_courses: user.taught_courses,
                    certifications: user.certifications
                };
            } else {
                // User is not enrolled in any course
                return {
                    username: user.username,
                    email: user.email
                };
            }
        });

        if (userDetails.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.json(userDetails);
    } catch (error) {
        console.error('Error retrieving user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

adminActions.post('/courses', async (req, res) => {
    try {
        const { course_name, duration, material_types, batch_number } = req.body;

        // Check if batch_number is provided
        if (!batch_number) {
            return res.status(400).json({ error: 'batch_number is required' });
        }

        const existingCourse = await prisma.course.findFirst({
            where: { course_name }
        });

        if (!existingCourse) {
            const newCourse = await prisma.course.create({
                data: {
                    course_name,
                    instructor_id: 1,
                    duration,
                    progress: 0
                }
            });

            const newMaterialBatch = await prisma.materialBatch.create({
                data: {
                    course_id: newCourse.course_id,
                    batch_number,
                    material_types
                }
            });

            // Return the new course with material batch info
            return res.json({
                course: newCourse,
                materialBatch: {
                    batch_number: newMaterialBatch.batch_number,
                    material_types: newMaterialBatch.material_types
                }
            });
        }

        const existingMaterialBatch = await prisma.materialBatch.findFirst({
            where: {
                course_id: existingCourse.course_id,
                batch_number
            }
        });

        if (existingMaterialBatch) {
            // Return existing course with existing material batch info
            return res.json({
                course: existingCourse,
                materialBatch: {
                    batch_number: existingMaterialBatch.batch_number,
                    material_types: existingMaterialBatch.material_types
                }
            });
        }

        const newMaterialBatch = await prisma.materialBatch.create({
            data: {
                course_id: existingCourse.course_id,
                batch_number,
                material_types
            }
        });

        // Return existing course with new material batch info
        res.json({
            course: existingCourse,
            materialBatch: {
                batch_number: newMaterialBatch.batch_number,
                material_types: newMaterialBatch.material_types
            }
        });
    } catch (error) {
        console.error('Error updating or creating course and material batch:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



adminActions.get('/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            select: {
                course_id: true,
                course_name: true,
                duration: true,
                progress: true,
                materialBatches: {
                    select: {
                        material_types: true,
                        batch_number: true
                    }
                }
            }
        });

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Create a new user
adminActions.post('/register',upload.single('profile_image'), checkSchema(registerSchema), async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).send({ status: "fail", errors})
    }
    const { username, email, password, profile_image } = req.body;
  
    // Check if username or email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
          email : email
      }
    });
  
    if (existingUser) {
      return res.status(400).json({ message: "Email  already exists" });
    }
  
    // Hash the password
    const hashedPassword = await generateHashedPassword(password);
  
    try {

      let profileImagePath = null;

      if (req.file) {
          // If a file is uploaded, save its path
          profileImagePath = req.file.path;
      } else {
          profileImagePath = "";
      }

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          profile_image: profileImagePath
        }
      });
      res.status(201).json({ message: "User registered successfully"});
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
});

//updating a user
adminActions.patch('/users/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { username, email, password, profile_image } = req.body;

        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: {
                username,
                email,
                password,
                profile_image
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

adminActions.delete('/users/:email', async (req, res) => {
    const email = req.params.email
    
    try {
      
        const user = await prisma.user.findUnique({
            where: {
               email:email
            },
            include: {
                taught_courses: true, 
                certifications: true  
            }
        });

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await prisma.user.delete({
            where: {
                 email:email
            }
        });

        // Return success response
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        // Handle error as needed
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a course
adminActions.delete('/courses/:courseId', async (req, res) => {
    const courseId = parseInt(req.params.courseId);
    try {
        await prisma.$transaction([
            prisma.materialBatch.deleteMany({
                where: {
                    course_id: courseId
                }
            }),
            prisma.certification.deleteMany({
                where: {
                    course_id: courseId
                }
            }),
            prisma.assessment.deleteMany({
                where: {
                    course_id: courseId
                }
            }),
            prisma.enrolledCourse.deleteMany({
                where: {
                    course_id: courseId
                }
            }),
            prisma.course.delete({
                where: {
                    course_id: courseId
                }
            })
        ]);

        return res.status(200).json({ message: 'Course and associated records deleted successfully' });
    } catch (error) {
        console.error('Error deleting course and associated records:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


adminActions.post('/assessments', async (req, res) => {
    try {
      const { question, choices, correctChoice, score, courseId } = req.body;
      const newAssessment = await prisma.assessment.create({
        data: {
          question,
          choices: choices.join(', '), // Convert choices array to string for storage
          correctChoice,
          score,
          course: {
            connect: { course_id: courseId },
          },
        },
      });
      res.status(201).json(newAssessment);
    } catch (error) {
      console.error('Error creating assessment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default adminActions;