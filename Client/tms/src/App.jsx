import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './components/RegLog/RegisterForm';
import LoginForm from './components/RegLog/LoginForm';
import Content from './components/content/Content';
import Home from './components/Home/Home';
import Course from './components/Courses/Course';
import Admin from './components/Admin/Admin';
import AssessmentForm from './components/Admin/AssessmentPost';
import UserAssessment from './components/UserAssessments/UserAssessment';
import CertificationPage from './components/Score/Certification';
import ScorePage from './components/Score/Score';
import Enrollment from './Enrollment/Enrollment';

function App() {
    // const [userId, setUserId] = useState(null);

    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route path='/register' element={<RegisterForm />} />
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/course' element={<Course  />} />
                    <Route path='/adminpage' element={<Admin />} />
                    <Route path='/content/:courseId' element={<Content />} />
                    <Route path='/assessment' element={<AssessmentForm />} />
                    <Route path='/assessment/:courseId' element={<UserAssessment />} />
                    <Route path = '/score/:courseId/:score' element={<ScorePage />} />
                    <Route path = 'certification' element={<CertificationPage/>} />
                    <Route path='/enrollment/:courseId' element={<Enrollment />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;