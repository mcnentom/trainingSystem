
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styling.scss';
// import { useUser } from '../UserContext'
// import UserProfile from '../Courses/UserProfile';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null); 
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    // const { setUser } = useUser();
    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('profile_image', profileImage);

            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const { username } = data;
                navigate('/login');
                // setUser(username)
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

    const navigateTo = async () => {
        navigate('/login');
    };

    return (
        <div className='general'>
            <div className='main_div'>
                <h1>Registration</h1>
                <form onSubmit={handleRegistration} className='formdiv'>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className='input' />

                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input' required />

                    <label>Password:</label>
                    <input
                        type={showPassword ? "text" : "password"} // Show password if showPassword is true
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input'
                        required
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

                    <div className='signUp'>
                        <p>Already have an account?</p>
                        <button onClick={navigateTo}>Sign In</button>
                    </div>
                </form>
            </div>
           
        </div>
    );
}

export default RegisterForm;
