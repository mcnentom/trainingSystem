import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styling.scss';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const userId = data.userId;
                // setUserId(userId); // Set user ID in parent component state
                localStorage.setItem('user_id', userId)
                const userType = data.userType;
                console.log(userType);
                if (userType === 'admin') {
                    navigate('/adminpage');
                } else if (userType === 'user') {
                    navigate('/course');
                } else {
                    alert('Invalid user type');
                }
            } else {
                const errorData = await response.json();
                alert(errorData.error.errors[0].msg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const navigateTo = async () => {
        navigate('/register');
    };

    return (
        <div className='general'>
            <div className='main_div'>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className='formdiv'>
                    <label>Email:</label>
                    <input
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='input'
                        autoComplete='email'
                    />
                    <br />
                    <label>Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input'
                        required
                        autoComplete='current-password'
                    />
                    <div>
                        <input type='checkbox' checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        <label>Show Password</label>
                        <br />
                    </div>
                    <button type='submit'>Login</button>
                    <div className='signUp'>
                        <p>Do not have an account?</p>
                        <button onClick={navigateTo}>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;