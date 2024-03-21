import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [userCourseInfo, setUserCourseInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:3000/adminActions/user-course-info',
                {withCredentials: true}
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>User Course Information</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Enrolled Courses</th>
                        <th>Certification</th>
                    </tr>
                </thead>
                <tbody>
                    {userCourseInfo.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <ul>
                                    {user.enrolled_courses.map(course => (
                                        <li key={course.course.course_name}>
                                            <strong>{course.course.course_name}</strong> - {course.progress}% complete
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{user.certification ? user.certification.date_achieved : 'Not certified'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
