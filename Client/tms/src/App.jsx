import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterForm from './components/RegLog/RegisterForm';
import LoginForm from './components/RegLog/LoginForm';
// import ContentPage from './components/ContentPage';
import Home from './components/Home/Home';
import Course from './components/Courses/Course';
import Admin from './components/Admin/Admin';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/register" element={<RegisterForm/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/discussion" element={<Course/>} />
        <Route path= "/adminpage" element={<Admin/>}/>
       
      </Routes>
    </Router>
  );
}

export default App;

