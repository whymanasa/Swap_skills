import { auth } from "../firebase-config";
import React, { useState } from "react";
import {createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/Sign_up.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Firebase sign up with email and password using async/await
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);
    } catch (err) {
      // Handle errors
      setError(err.message);
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <i
            className={`uil ${showPassword ? "uil-eye" : "uil-eye-slash"}`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
