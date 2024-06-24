// import React from 'react';
import {  useNavigate, useParams } from 'react-router-dom';

const ScorePage = () => {
    const {courseId, score } = useParams();
    const navigate = useNavigate();

    localStorage.setItem('course_id', courseId);
    const handleContinueToCertification = () => {
        navigate(`/certification`);
    };

    const handleRetryAssessment = () => {
        navigate(`/assessment/${courseId}`);
    };

    return (
        <div>
            <h2>Score Page</h2>
            <p>Your score: {score}%</p>
            {score >= 50 ? (
                <button onClick={handleContinueToCertification}>Continue to Certification</button>
            ) : (
                <button onClick={handleRetryAssessment}>Retry Assessment</button>
            )}
        </div>
    );
};

export default ScorePage;
