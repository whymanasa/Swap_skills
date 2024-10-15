import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/footer';
import SignUp from './components/Sign_up';
import Profile from './components/Profile';
import MainPage from './components/MainPage.jsx';
import Search from './components/Search.jsx';
import Message from './components/Message.jsx'
import { auth } from './firebase-config.jsx'; // Import your Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from './helpers/protectedRoute.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if user exists, false otherwise
      setLoading(false);
    });
    

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  if (loading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Footer/>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/how-it-works" element={<HowItWorks />} />*/}
          <Route path="/sign-up" element={<SignUp onLogin={handleLogin} />} /> 
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mainpage" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPage onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Search  onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/message" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Message onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
