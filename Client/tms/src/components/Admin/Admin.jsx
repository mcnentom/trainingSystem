import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.scss'

function AdminDashboard() {
    const [userCourseInfo, setUserCourseInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('user');
    const [newCourseName, setNewCourseName] = useState('');
    const [newDuration, setNewDuration] = useState('');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:3000/adminActions/user-course-info',
                    { withCredentials: true }
                );
                setUserCourseInfo(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Something went wrong');
                setLoading(false);
            }
        }

        fetchData();
    }, []);
   
    const addCourse = async (e) => {
        e.preventDefault(); 
        try {
            const response = await fetch('http://localhost:3000/adminActions/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_name: newCourseName,
                    duration: newDuration,
                }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to add course');
            }
            const data = await response.json();
            setUserCourseInfo([...userCourseInfo, data]);
            setNewCourseName('');
            setNewDuration('');
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='Admin'>
            <h1 className='heading1'>Welcome To the Admin Dashboard</h1>
           <div className='AdminDiv'>
           <div className='sidebar'>
                <ul>
                    <li onClick={() => handleTabClick('user')} className='mylist'>User Management</li>
                    <li onClick={() => handleTabClick('course')} className='mylist'>Course Management</li>
                    <li onClick={() => handleTabClick('content')} className='mylist'>Content Management</li>
                </ul>
            </div>
            <div className='content'>
                {activeTab === 'user' && (
                    <div>
                        <ul>
                            <h1 className='heading'>User Management</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Enrolled Courses</th>
                                        <th>Progress</th>
                                        <th>Certification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userCourseInfo.map(user => (
                                        <tr key={user.username}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.course}</td>
                                            <td>{user.courseEnrollment}</td>
                                            <td>{user.certification ? user.certification.date_achieved : 'Not certified'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ul>
                    </div>
                )}
                {activeTab === 'course' && (
                     <div>
                        <ul>
                        <h2>Course Management</h2>
                     
                     <form onSubmit={addCourse}>
                         <label>Course Name:</label>
                         <input type="text" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} />
                         <label>Duration:</label>
                         <input type="text" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
                         <button type="submit">Add Course</button>
                     </form>
                     <table>
                         <thead>
                             <tr>
                                 <th>Course Name</th>
                                 <th>Duration</th>
                             </tr>
                         </thead>
                         <tbody>
                             {userCourseInfo.map(course => (
                                 <tr key={course.course_id}>
                                     <td>{course.course_name}</td>
                                     <td>{course.duration}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                        </ul>
                     
                 </div>
                )}
                {activeTab === 'content' && (
                    <div>
                        <h2>Content Management</h2>
                    </div>
                )}
            </div>
           </div>
            

        </div>
    );
}

export default AdminDashboard;
