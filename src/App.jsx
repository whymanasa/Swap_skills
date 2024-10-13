import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/footer';
import SignUp from './components/Sign_up';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Footer/>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/how-it-works" element={<HowItWorks />} />*/}
          <Route path="/sign-up" element={<SignUp />} /> 
          <Route path="/profile" element={<Profile />} /> 
          
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
