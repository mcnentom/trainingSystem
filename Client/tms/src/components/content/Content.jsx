import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Content = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [finishedBatches, setFinishedBatches] = useState([]);

    useEffect(() => {
        // Fetch course details from the API based on the courseId
        fetch(`http://localhost:3000/userActions/courses/${courseId}`)
            .then(response => response.json())
            .then(data => setCourseDetails(data))
            .catch(error => console.error('Error fetching course details:', error));
    }, [courseId]);

    const handleNextBatch = () => {
        if (currentBatch < courseDetails.materialBatches.length - 1) {
            setCurrentBatch(prevBatch => prevBatch + 1);
        }
    };

    const handlePrevBatch = () => {
        if (currentBatch > 0) {
            setCurrentBatch(prevBatch => prevBatch - 1);
        }
    };

    const handleMarkAsFinished = () => {
        if (!finishedBatches.includes(currentBatch)) {
            setFinishedBatches(prevFinishedBatches => [...prevFinishedBatches, currentBatch]);
            setCourseDetails(prevCourseDetails => ({
                ...prevCourseDetails,
                progress: prevCourseDetails.progress + 20
            }));
        }
    };

    const handleTakeQuiz = () => {
        // Navigate to assessment page
        navigate(`/assessment/${courseId}`);
    };

    if (!courseDetails) {
        return <div>Loading...</div>;
    }

    const { materialBatches } = courseDetails;
    const totalBatches = materialBatches.length;

    if (currentBatch >= totalBatches) {
        return <div>No more batches available.</div>;
    }

    const currentBatchData = materialBatches[currentBatch];

    return (
        <div>
            <h2>{courseDetails.course_name}</h2>
            {currentBatch === 0 && <p>Duration: {courseDetails.duration} days</p>}
            <p>Progress: {courseDetails.progress} %</p>
            <h3>Course Content (Batch {currentBatchData.batch_number}):</h3>
            <ul>
                {currentBatchData.material_types.split('. ').map((material, index) => (
                    <li key={index}>{material}</li>
                ))}
            </ul>
            <div>
                <button onClick={handlePrevBatch} disabled={currentBatch === 0}>
                    Prev
                </button>
                <button onClick={handleMarkAsFinished}>Mark as Finished</button>
                {currentBatch === totalBatches - 1 ? (
                    <button onClick={handleTakeQuiz}>Take a Quiz</button>
                ) : (
                    <button onClick={handleNextBatch} disabled={currentBatch === totalBatches - 1}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Content;
