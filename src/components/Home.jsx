import React from "react";
import img from "../assets/img-1.webp";
import image from "../assets/img-2.jpeg";
import { Link } from "react-router-dom";

import "../styles/Home.css";
function Home() {
  return (
      <div className="container">
        <div className="content-left">
          <h1>A cool barter system</h1>
          <p>Exchange your skills for a new one</p>
          <p>ʕ⁠⁠ꈍ⁠ᴥ⁠ꈍ⁠ʔ</p>
          <Link to="/sign-up">
          <button className="cta-button">Let's Start</button>
          </Link>
          
        </div>
        <div className="content-right">
        
        <img src={image} alt="hero image" className="image2"/>
        <img src={img} alt="hero image" className="image1" />
        
        </div>
    </div>
  );
}

export default Home;
