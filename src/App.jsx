import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/footer';
import SignUp from './components/Sign_up';
import Profile from './components/Profile';
import Search from './components/Search.jsx';
import Message from './components/Message.jsx';
import { auth } from '../firebase-config.jsx'; // Import your Firebase auth
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import ProtectedRoute from './helpers/protectedRoute.jsx';
import MainPage from './components/MainPage.jsx'; // Update import to MainPage
import About from './components/About';
import Chat from './helpers/Chat.jsx';

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

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      setIsAuthenticated(false); // Update authentication state
      setCurrentUserId(null); // Reset current user ID
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication state to true
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} /> {/* Pass isAuthenticated to Navbar */}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp onLogin={handleLogin} />} /> {/* Pass onLogin function */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile onLogout={handleLogout} /> {/* Pass onLogout function */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mainpage" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPage currentUserId={currentUserId} onLogout={handleLogout} /> {/* Pass onLogout function */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Search currentUserId={currentUserId} onLogout={handleLogout} /> {/* Pass onLogout function */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/message" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Message onLogout={handleLogout} currentUserId={currentUserId} /> {/* Pass onLogout function */}
              </ProtectedRoute>
            } 
          />
          <Route path="/how-it-works" element={<About />} />
          <Route path="/chat/:recipientToken" element={<Chat />} />
        </Routes>
        
      </div>
      <Footer />
    </Router>
  );
}

export default App;
