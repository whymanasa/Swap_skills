import { auth } from "../firebase-config";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Sign_up.css";

const SignUp = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
      navigate('/profile');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' 
        ? "This email address is already in use. Please use a different email." 
        : err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      {isLogin ? (
        <form onSubmit={handleLogin} className="signup-form">
          <h2>Log In</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="signup-btn">Log In</button>
          <p className="toggle-form">
            Don't have an account? <span onClick={() => setIsLogin(false)} className="toggle-link">Sign Up</span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignUp} className="signup-form">
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
          <p className="toggle-form">
            Already have an account? <span onClick={() => setIsLogin(true)} className="toggle-link">Log In</span>
          </p>
        </form>
      )}
    </div>
  );
};

export default SignUp;
