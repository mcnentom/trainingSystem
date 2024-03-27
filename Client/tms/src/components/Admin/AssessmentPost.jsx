import React, { useState, useEffect } from 'react';
import './Assessment.scss'

const AssessmentForm = () => {
  const [formData, setFormData] = useState({
    question: '',
    choices: ['', '', '', ''], 
    correctChoice: 0,
    courseId: '', 
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch list of courses from the backend when the component mounts
    fetch('http://localhost:3000/adminActions/courses')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'choices') {
      const updatedChoices = [...formData.choices];
      updatedChoices[index] = value;
      setFormData({ ...formData, choices: updatedChoices });
    } else if (name === 'courseId') {
      // Convert courseId to integer before setting the form data
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else if (name === 'correctChoice') {
      // Convert correctChoice to integer before setting the form data
      setFormData({ ...formData, [name]: parseInt(value, 4) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const correctChoiceInt = parseInt(formData.correctChoice, 4);
      const formDataWithIntCorrectChoice = {
        ...formData,
        correctChoice: correctChoiceInt,
      };
  
      const response = await fetch('http://localhost:3000/adminActions/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithIntCorrectChoice), // Use the modified formData
      });
  
      if (response.ok) {
        alert('Assessment created successfully!');
      } else {
        throw new Error('Failed to create assessment');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert('Failed to create assessment. Please try again.');
    }
  };
  

  return (
    <div className='assessment'>
      <h2>Create Assessment</h2>
      <form onSubmit={handleSubmit} className='Myform'>
        <label>
          Question:
          <textarea
            type="text"
            name="question"
            value={formData.question}
            onChange={(e) => handleChange(e)}
            required
            className='question'
          />
        </label>
        <br />
        {formData.choices.map((choice, index) => (
          <label key={index}className='choice'>
            Choice {index + 1}:
            <input
              type="text"
              name="choices"
              value={choice}
              onChange={(e) => handleChange(e, index)}
              required
              className='choices'
            />
          </label>
        ))}
        <br />
        <label>
          Correct Choice:
          <input
            type="number"
            name="correctChoice"
            value={formData.correctChoice}
            onChange={(e) => handleChange(e)}
            required
            className='Score'
          />
        </label>
        <br />
        <label>
          Course:
          <select
            name="courseId"
            value={formData.courseId}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Create Assessment</button>
      </form>
    </div>
  );
};

export default AssessmentForm;
