import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CertificationPage = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);

    const handleCertificationSubmit = async() => {
        try {
            const userId = localStorage.getItem('user_id');
            const courseId = localStorage.getItem('course_id');
            const dateAchieved = new Date().toISOString();

            // Make a POST request to the API endpoint to create a new certification
            const response = await fetch('http://localhost:3000/userActions/certifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    course_id:parseInt(courseId),
                    date_achieved: dateAchieved,
                }),
            });

            if (response.ok) {
                // Certification created successfully
                setShowCertificate(true);
            } else {
                // Handle error response
                const errorMessage = await response.text();
                console.log(errorMessage);
            }
        } catch (error) {
            console.error('Error creating certification:', error);
            setError('An error occurred while creating the certification.');
            
        }
    };

       
    

    const handleReturnToAssessment = () => {
        navigate(`/course`);
    };

    return (
        <div>
            <h2>Certification Page</h2>
            {!showCertificate ? (
                <div>
                    <label>Full Name:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <button onClick={handleCertificationSubmit}>Submit</button>
                </div>
            ) : (
                <div>
                    <p>Congratulations {fullName} on completing the course!</p>
                    
                    <button onClick={handleReturnToAssessment}>Return to Courses</button>
                </div>
            )}
        </div>
    );
};

export default CertificationPage;
