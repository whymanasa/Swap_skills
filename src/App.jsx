import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/footer';
import SignUp from './components/Sign_up';
import Profile from './components/Profile';
import Search from './components/Search.jsx';
import Message from './components/Message.jsx';
import { auth } from './firebase-config.jsx'; // Import your Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from './helpers/protectedRoute.jsx';
import MainPage from './components/MainPage.jsx'; // Update import to MainPage

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null); // State for current user ID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUserId(user.uid); // Set the current user's ID
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null); // Reset if no user is logged in
      }
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
        
        <Routes>
          <Route path="/" element={<Home />} />
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
                <MainPage currentUserId={currentUserId} onLogout={handleLogout} /> {/* Pass current user ID */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Search onLogout={handleLogout} currentUserId={currentUserId}/>
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
          <Route 
            path="/user-profiles" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPage currentUserId={currentUserId} /> {/* Pass current user ID */}
              </ProtectedRoute>
            } 
          />
        </Routes>
        
      </div>
      <Footer />
    </Router>
  );
}

export default App;
