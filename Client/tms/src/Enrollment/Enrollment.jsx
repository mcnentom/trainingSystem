import React from 'react'
import { useNavigate, useParams} from 'react-router-dom';
import { enrollCourse } from '../Redux/Fetch';
import { useDispatch } from 'react-redux';

const Enrollment = () => {
    const navigate = useNavigate();
    const{ courseId} = useParams();
    const dispatch = useDispatch();
    // const courseId = localStorage.getItem('course_id');
    const handleEnroll = async() => {
        try {
           await dispatch(enrollCourse(courseId))
           navigate(`/content/${courseId}`)
        } catch (error) {
           return error.message; 
        }
        
    }
  return (
    <div>
         <button onClick={()=>handleEnroll(courseId)}>Enroll</button>
    </div>
  )
}

export default Enrollment