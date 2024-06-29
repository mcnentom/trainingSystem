import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Content.scss'

const Content = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [finishedBatches, setFinishedBatches] = useState([]);
    // const [showContent, setShowContent] = useState(false);
    // const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        // Fetch course details from the API based on the courseId
        fetch(`http://localhost:3000/userActions/courses/${courseId}`)
            .then(response => response.json())
            .then(data => {
                setCourseDetails(data)

            })
            .catch(error => console.error('Error fetching course details:', error));
    }, [courseId]);
    // const handleEnrollUser = async (courseId) => {
    //     try {
    //         // Post enrollment data to the API
    //         const userId = localStorage.getItem('user_id');
    //         const response = await fetch('http://localhost:3000/userActions/enrolled', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ user_id: parseInt(userId), course_id: parseInt(courseId) }),
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to enroll in the course');
    //         }
    //         setShowContent(true);

    //     } catch (error) {
    //         console.error('Error in posting data', error);
    //     }
    // }
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
            const totalBatches = courseDetails.materialBatches.length;
            const progressIncrement = 100 / totalBatches; // Calculate the increment dynamically
    
            setFinishedBatches(prevFinishedBatches => [...prevFinishedBatches, currentBatch]);
            setCourseDetails(prevCourseDetails => ({
                ...prevCourseDetails,
                progress: Math.min(prevCourseDetails.progress + progressIncrement, 100) // Ensure progress doesn't exceed 100%
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
    const handleBatchClick = (batchIndex) => {
        setCurrentBatch(batchIndex)
    }

    return (
        <div className='ContentMainDiv'>
            <div className='sideBarDiv'>
               <ul className='sideBarList'>
                <h2>Content</h2>
                {materialBatches.map((batch,index) =>(
                    <li 
                    key={index}
                    className={`batchItem ${index === currentBatch ? 'active' : ''}`}
                    onClick={()=> handleBatchClick(index)}>
                        Batch{batch.batch_number}
                    </li>
                ))

                }
               </ul>
            </div>
           

            <div className='ContentDiv'>
                <div className='topBackground'></div>
                <h2>{courseDetails.course_name}</h2>
                {currentBatch === 0 && <p>Duration: {courseDetails.duration} days</p>}
                <p>Progress: {courseDetails.progress} %</p>
                <h3>Course Content (Batch {currentBatchData.batch_number})</h3>
                <ul className='ContentList'>
                    {currentBatchData.material_types.split('. ').map((material, index) => (
                        <li key={index}>{material}</li>
                    ))}
                </ul>
                <div className='ContentButtons'>
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

        </div>
    );
};

export default Content;
