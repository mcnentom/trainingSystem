// import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "./Score.scss";

const ScorePage = () => {
  const { courseId, score } = useParams();
  const navigate = useNavigate();

  localStorage.setItem("course_id", courseId);
  const handleContinueToCertification = () => {
    navigate(`/certification`);
  };

  const handleRetryAssessment = () => {
    navigate(`/assessment/${courseId}`);
  };

  return (
    <div className="scoreMainDiv">
      <div className="scoreDivContent">
        <h2>Score</h2>
        <p>You scored: {score}%</p>
        {score >= 50 ? (
          <button onClick={handleContinueToCertification}>
            Continue to Certification
          </button>
        ) : (
          <button onClick={handleRetryAssessment}>Retry Assessment</button>
        )}
      </div>
    </div>
  );
};

export default ScorePage;
