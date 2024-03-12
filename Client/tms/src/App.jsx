import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterForm from './components/RegLog/RegisterForm';
import LoginForm from './components/RegLog/LoginForm';
import ContentPage from './components/ContentPage';
import Home from './components/Home/Home';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/register" element={<RegisterForm/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/content" element={<ContentPage/>} />
       
      </Routes>
    </Router>
  );
}

export default App;

