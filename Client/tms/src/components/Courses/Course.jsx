import {useEffect,useState } from 'react'
import image1 from '../../assets/pexels-andrea-piacquadio-3781529.jpg'
import image2 from '../../assets/pexels-antoni-shkraba-5306424.jpg'
import image3 from '../../assets/pexels-kampus-production-7551618.jpg'
import image4 from '../../assets/pexels-mikhail-nilov-6592677.jpg'
import image5 from '../../assets/Daisy.jpg'
import image6 from '../../assets/Background.jpg'
import image7 from '../../assets/GetStarted.jpg'
import image8 from '../../assets/andrea.png'
import image9 from '../../assets/krasnikova.jpg'
import { useNavigate } from 'react-router-dom'
import './Course.scss'
import Main from './Main'



const Course = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch course list from the API
        fetch('http://localhost:3000/userActions/courses') 
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);
    const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9];
    const handleEnroll = async (courseId) => {
        try {
            // Navigate to the content page
            navigate(`/content/${courseId}`);
    
            // Post enrollment data to the API
            const userId = localStorage.getItem('user_id');
            const response = await fetch('http://localhost:3000/userActions/enrolled', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: parseInt(userId), course_id: courseId }),
            });
            if (!response.ok) {
                throw new Error('Failed to enroll in the course');
            }
        } catch (error) {
            console.error('Error enrolling in the course:', error);
            
        }
    };
    return (
        <div className='course'>
            <h1>Our Esteemed Courses</h1>
            <div>
               
            </div>
            <div className='CoursesDiv'>
                {courses.map((course, index) => (
                    <div className='myCourse' key={course.course_id}>
                        <img src={images[index % images.length]} alt={course.course_name}/>
                        <h3>{course.course_name}</h3>
                        <button onClick={() => handleEnroll(course.course_id)}>Enroll</button>
                    </div>
                ))}
            </div>
            <Main/>
        </div>
    );
}

export default Course