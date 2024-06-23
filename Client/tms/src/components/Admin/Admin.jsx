import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.scss'
import AssessmentForm from './AssessmentPost';

function AdminDashboard() {
    const [userCourseInfo, setUserCourseInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('user');
    const [newCourseName, setNewCourseName] = useState('');
    const [newDuration, setNewDuration] = useState('');
    const [newMaterialTypes, setNewMaterialTypes] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:3000/adminActions/users',
                { withCredentials: true }
            );
            setUserCourseInfo(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Something went wrong');
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);


    async function fetchCourses() {
        try {
            const coursesResponse = await axios.get('http://localhost:3000/adminActions/courses', { withCredentials: true });
            const coursesData = coursesResponse.data;
            setUserCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);

        }
    }

    useEffect(() => {
        fetchCourses();
    }, [newCourseName]);

    const addCourse = async (e) => {
        e.preventDefault();
        try {
            const durationInt = parseInt(newDuration);
            const response = await fetch('http://localhost:3000/adminActions/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_name: newCourseName,
                    duration: durationInt,
                    material_types: newMaterialTypes
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to add course');
            }

            const data = await response.json();

            setNewCourseName('');
            setNewDuration('');
            setNewMaterialTypes([]);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('profile_image', profileImage);

            const response = await fetch('http://localhost:3000/adminActions/register', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);

                setActiveTab('user');
                setEmail('');
                setPassword('');
                setUsername('')
            } else {
                const errorData = await response.json();
                alert(errorData.errors.errors[0].msg);

            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };
    const handleDeleteUser = async (email) => {
        console.log('Deleting user with ID:', email);
        try {
            const response = await axios.delete(`http://localhost:3000/adminActions/users/${email}`, { withCredentials: true });
            console.log(response.data); 
     
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            
        }
    };
    const handleNavClick = ()=>{
        navigate('/assessment')
    }
    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/adminActions/courses/${courseId}`, { withCredentials: true });
            console.log(response.data); 
         
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            
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
                        <li onClick={() => handleTabClick('content')} className='mylist'>User Registration</li>
                        <li onClick={handleNavClick} className='mylist'>Assessments Management</li>
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
                                            <th>Taught Courses</th>
                                            <th>Certification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userCourseInfo.map(user => (
                                            <tr key={user.username}>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Course Name</th>
                                                                <th>Duration</th>
                                                                <th>Progress</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {user.taught_courses.map(course => (
                                                                <tr key={course.course_name}>
                                                                    <td>{course.course_name}</td>
                                                                    <td>{course.duration}</td>
                                                                    <td>{course.progress}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td>{user.certification ? user.certification.date_achieved : 'Not certified'}</td>
                                                <td>
                                                    <button onClick={() => handleDeleteUser(user.email)}>Delete</button>
                                                </td>
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
                                    {/* Assuming newMaterialTypes is an array state */}
                                    <label>Material Types:</label>
                                    <textarea value={newMaterialTypes} onChange={(e) => setNewMaterialTypes(e.target.value)} />
                                    <button type="submit">Add Course</button>
                                </form>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Duration</th>

                                            {/* <th>Material Types</th>
                                            <th>Batch Number</th> */}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userCourses.map(course => (
                                            <tr key={course.course_id}>
                                                <td>{course.course_name}</td>
                                                <td>{course.duration}</td>
                                                {/* <td>
                {course.materialBatches && course.materialBatches.map(batch => (
                    <div key={batch.batch_id}>
                        {batch.material_types} - Batch {batch.batch_number}
                    </div>
                ))}
            </td>
            <td>{course.batch_number}</td> */}
                                                <td>
                                                    <button onClick={() => handleDeleteCourse(course.course_id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div>
                            <h1>Registration</h1>
                            <form onSubmit={handleRegistration} className='formdiv'>
                                <label>Username:</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className='input' autoComplete='username' />

                                <label>Email:</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input' required autoComplete='username' />

                                <label>Password:</label>
                                <input
                                    type={showPassword ? "text" : "password"} // Show password if showPassword is true
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='input'
                                    required
                                    autoComplete="current-password"

                                />
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    <label>Show Password</label>
                                </div>


                                <label>Profile Image:</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} className='input' />

                                <button type="submit">Register</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

export default AdminDashboard;
