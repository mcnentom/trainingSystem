import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserAssessment.scss'

const AssessmentPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [selectedChoices, setSelectedChoices] = useState({});
    const [score, setScore] = useState(null);

    useEffect(() => {
        // Fetch assessments for the courseId from the API
        fetch(`http://localhost:3000/userActions/assessments/${courseId}`)
            .then(response => response.json())
            .then(data => {
                // Initialize selectedChoices state with empty values for each assessment
                const initialSelectedChoices = {};
                data.forEach(assessment => {
                    initialSelectedChoices[assessment.id] = null;
                });
                setSelectedChoices(initialSelectedChoices);
                setAssessments(data);
            })
            .catch(error => console.error('Error fetching assessments:', error));
    }, [courseId]);

    const handleChoiceChange = (assessmentId, choiceIndex) => {
        setSelectedChoices(prevSelectedChoices => ({
            ...prevSelectedChoices,
            [assessmentId]: choiceIndex,
        }));
    };

    const handleSubmit = async () => {
        try {
            // Compare user's choices with correct choices to calculate score
            let totalCorrectChoices = 0;
            assessments.forEach(assessment => {
                if (selectedChoices[assessment.id] === assessment.correctChoice) {
                    totalCorrectChoices++;
                }
            });
            const newScore = (totalCorrectChoices / assessments.length) * 100;
            setScore(newScore);
            console.log(score)

            // Send the score to the backend API
            const userId = localStorage.getItem("user_id");
            const response = await fetch("http://localhost:3000/userActions/score", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    course_id: parseInt(courseId),
                    score: newScore,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update score');
            }

            // Route to ScorePage
            navigate(`/score/${courseId}/${newScore}`);
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };


    return (
        <div className='userAssessment'>
            <h2>Assessment Page</h2>
            <div className='assessmentDiv'>
            {assessments.map(assessment => (
                <div key={assessment.id} className='assessmentform'>
                    <p>Question: {assessment.question}</p>
                    {assessment.choices.split(',').map((choice, choiceIndex) => (
                        <label key={choiceIndex}>
                            <input
                                type="radio"
                                name={`choice-${assessment.id}`}
                                value={choiceIndex}
                                checked={selectedChoices[assessment.id] === choiceIndex}
                                onChange={() => handleChoiceChange(assessment.id, choiceIndex)}
                            />
                            {choice}
                        </label>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit Choices</button>
            </div>
            
        </div>
    );
};

export default AssessmentPage;
