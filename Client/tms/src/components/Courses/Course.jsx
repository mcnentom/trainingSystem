import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchEnrolledCourse} from '../../Redux/Fetch';
import { courses } from '../../Redux/FetchCourses';
import { useNavigate } from 'react-router-dom';
import './Course.scss';
import Main from './Main';
import image1 from '../../assets/pexels-andrea-piacquadio-3781529.jpg'
import image2 from '../../assets/pexels-antoni-shkraba-5306424.jpg'
import image3 from '../../assets/pexels-kampus-production-7551618.jpg'
import image4 from '../../assets/pexels-mikhail-nilov-6592677.jpg'
import image5 from '../../assets/Daisy.jpg'
import image6 from '../../assets/Background.jpg'
import image7 from '../../assets/GetStarted.jpg'
import image8 from '../../assets/andrea.png'
import image9 from '../../assets/krasnikova.jpg'

const Course = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const coursesData = useSelector((state) => state.courses.courses); 
    const enrollments = useSelector((state) => state.enrollment.enrolledCourse); 

    useEffect(() => {
        dispatch(courses());
        dispatch(FetchEnrolledCourse());
    }, [dispatch]);

    const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9];
 
    const NavigateToEnroll = async (courseId,courseName, courseImage) => {
        try {
            // dispatch(enrollCourse(courseId));
            navigate(`/enrollment/${courseId}/${encodeURIComponent(courseName)}/${encodeURIComponent(courseImage)}`); 
        } catch (error) {
            console.error('Error enrolling in the course:', error);
        }
    };
    const NavigateToContent = async(courseId) => {
        try {
            navigate(`/content/${courseId}`)
        } catch (error) {
            console.error('Error enrolling in the course:', error);   
        }
    }

    return (
        <div className='course'>
            <h1>Our Esteemed Courses</h1>
            <div className='CoursesDiv'>
                {coursesData.map((course, index) => {
                    const enrollment = enrollments.find((enroll) => enroll.course_id === course.course_id);
                    return (
                        <div className='myCourse' key={course.course_id}>
                            <img src={images[index % images.length]} alt={course.course_name} />
                            <h3>{course.course_name}</h3>
                            {enrollment ? (
                                enrollment.certification ? (
                                    <button>Finished</button>
                                ) : (
                                    <button onClick={() => NavigateToContent(course.course_id)}>Continue to course</button>
                                )
                            ) : (
                                <button onClick={() => NavigateToEnroll(course.course_id, course.course_name, images[index % images.length])}>Enroll</button>
                            )}
                        </div>
                    );
                })}
            </div>
            <Main />
        </div>
    );
};

export default Course;
