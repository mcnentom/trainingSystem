import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterForm from './components/RegLog/RegisterForm';
import LoginForm from './components/RegLog/LoginForm';
import Content from './components/content/Content';
import Home from './components/Home/Home';
import Course from './components/Courses/Course';
import Admin from './components/Admin/Admin';


function App() {
  
  return (
    <div>
      <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/course" element={<Course/>} />
        <Route path= "/adminpage" element={<Admin/>}/>
       <Route path= "/content/:courseId" element={<Content/>} />
      </Routes>
    </Router>
    </div>
    
    
  );
}

export default App;

