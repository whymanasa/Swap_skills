import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/footer';
import SignUp from './components/Sign_up';
import Profile from './components/Profile';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} />
        <Footer/>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/how-it-works" element={<HowItWorks />} />*/}
          <Route path="/sign-up" element={<SignUp onLogin={handleLogin} />} /> 
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} /> 
          
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
