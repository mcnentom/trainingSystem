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
// import DiscussionForum from '../Discussion/Discussion'
import { useNavigate } from 'react-router-dom'
import './Course.scss'


const Course = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch course list from the API
        fetch('http://localhost:3000/userActions/courses') // Assuming this endpoint exists
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleEnroll = (courseId) => {
        navigate(`/content/${courseId}`);
    };

    return (
        <div className='course'>
            <h1>Our Esteemed Courses</h1>
            <div className='CoursesDiv'>
                {courses.map(course => (
                    <div className='myCourse' key={course.course_id}>
                        {/* <img src=Add image source here alt="" /> */}
                        <h3>{course.course_name}</h3>
                        <button onClick={() => handleEnroll(course.course_id)}>Enroll</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Course