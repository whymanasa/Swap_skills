import { auth } from "../firebase-config";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Sign_up.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Firebase sign up with email and password using async/await
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);

      // Log in the user immediately after sign-up
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the profile page after successful sign-up and login
      navigate('/profile');
    } catch (err) {
      // Handle errors
      if (err.code === 'auth/email-already-in-use') {
        setError("This email address is already in use. Please use a different email.");
      } else {
        setError(err.message); // Handle other errors
      }
      console.error("Error during sign up:", err);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignUp} className="signup-form">
        <h2>Sign Up</h2>

        {error && <p className="error">{error}</p>}

        <div className="input-box">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
