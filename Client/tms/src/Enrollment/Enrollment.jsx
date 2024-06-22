import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { enrollCourse } from '../Redux/Fetch';
import { useDispatch } from 'react-redux';
import { BiChevronDown } from "react-icons/bi";
import { BiChevronUp } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import { IoIosPerson } from "react-icons/io";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import './Enrollment.scss'

const Enrollment = () => {
  const navigate = useNavigate();
  const { courseId, courseName, courseImage } = useParams();
  const dispatch = useDispatch();
  // const parsedCourseInfo = JSON.parse(decodeURIComponent(courseInfo));
  // console.log(parsedCourseInfo);
  // const courseId = localStorage.getItem('course_id');
  const handleEnroll = async () => {
    try {
      await dispatch(enrollCourse(courseId))
      navigate(`/content/${courseId}`)
    } catch (error) {
      return error.message;
    }

  }
  const courseInfo = [
    {
      courseId: 1,
      description: "This course covers the basics of frontend development",
      skills: "HTML,CSS,Javascript, React,Redux, Redux toolkit, State management hooks",
      icon: <IoPersonCircle />,
      Instructor: "Joe Doe",
      FAQS: {
        Questions: ['Nisi ea adipisicing consectetur nostrud ut aliqua.', 'Excepteur labore nisi in in.', 'Nulla deserunt elit non aliqua nostrud aliqua tempor velit veniam laborum aliqua culpa id enim.'],
        Answers: ['Nisi ea adipisicing consectetur nostrud', 'Exercitation aute magna minim pariatur consectetur nostrud aute nisi voluptate.', 'Laboris ea ut nostrud reprehenderit do officia non ipsum ullamco reprehenderit occaecat.']
      }
    },
    {
      courseId: 2,
      description: "This course covers the basics of backend development",
      icon: <IoIosPerson />,
      Instructor: "Joe Doe",
      FAQS: {
        Questions: ['Nisi ea adipisicing consectetur nostrud ut aliqua.', 'Excepteur labore nisi in in.', 'Nulla deserunt elit non aliqua nostrud aliqua tempor velit veniam laborum aliqua culpa id enim.'],
        Answers: ['Nisi ea adipisicing consectetur nostrud', 'Exercitation aute magna minim pariatur consectetur nostrud aute nisi voluptate.', 'Laboris ea ut nostrud reprehenderit do officia non ipsum ullamco reprehenderit occaecat.']
      }
    }
  ]
  const selectedCourseInfo = courseInfo.find(info => info.courseId === parseInt(courseId, 10));
  //state to manage visibility
  const [faqVisibility, setFaqVisibility] = useState(Array(selectedCourseInfo.FAQS.Questions.length).fill(false));

  //function to toggle visibility
  const toggleVisibility = (index) => {
    setFaqVisibility(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    })
  }
  return (
    <div className='EnrollmentDiv'>
      <div className="headerDiv">
        <img src={decodeURIComponent(courseImage)} alt={decodeURIComponent(courseName)} />
        <h2>{decodeURIComponent(courseName)}</h2>
        <button onClick={() => handleEnroll(courseId)} className='enrollmentButton'>Enroll</button>
      </div>
      <div className="footDiv">
        <h2>About this course</h2>
        <p>{selectedCourseInfo.description}</p>
        <p>Skills Acquired:{selectedCourseInfo.skills}</p>
        <h2>FAQs</h2>
        {selectedCourseInfo.FAQS.Questions.map((question, index) => (
          <div key={index} className='faqItem'>
            <div className='question' onClick={() => toggleVisibility(index)}>
              <span className='questions'><FaArrowRightFromBracket />{question}</span>
              <span>{faqVisibility[index] ? <BiChevronUp className='icon' /> : <BiChevronDown className='icon' />}</span>
            </div>
            {faqVisibility[index] && <p className='answer'> <MdSubdirectoryArrowRight /> {selectedCourseInfo.FAQS.Answers[index]}</p>}
          </div>
        ))}
        <div>
          <h2>Know the instructor</h2>
          <p className='instructorIcon'>{selectedCourseInfo.icon}</p>
          <p className='instructorName'>{selectedCourseInfo.Instructor}</p>
        </div>

      </div>


    </div>
  )
}

export default Enrollment