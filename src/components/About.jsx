import React from 'react';
import bannerimage from '../styles/Banner2.jpg';

import { BsFilePersonFill } from "react-icons/bs";
import { IoLogoWechat } from "react-icons/io5";
import { MdOutlineMobileFriendly } from "react-icons/md";
import '../styles/About.css';

function About() {
    return ( 
       <>
        
        
       <div className='about'>
        <h1 >ABOUT US</h1>
        <br/><br/>

        <div>
            <p> Hey there fellow learner! Welcome to Swap'em, a place where the community shares their learning in the best way possible. We believe everyone has a talent or skill worth sharing — and something new they’d love to pick up. Whether it’s learning a new language, coding your first app, or finally mastering the guitar, Swap’em helps you connect with people who have the skills you want and are excited to learn from what you know. We'd like to foster a culture of collaboration where learning is a two-way street, empowering everyone to grow together. Join us today, and let's swap skills, stories, and a little inspiration along the way!</p>
        </div>
       </div>

       <div className= 'title'>    
            <h3 > Here's How it Works!</h3>
        </div>
        
            
        <div className="CardContainer">
        
            <div className ="Card">
                    <BsFilePersonFill  className='icon' size="100px" color='#3B3030'  object-fit='cover' margin  />
                
            
                <h2 className= "Card-title">Set Up Your Profile</h2>
                <p>Sign Up. Create Your Profile. <br/>
                    After which you can go right ahead to add your skills and search for ones you are interested in learning!</p>
            </div>
            <div className ="Card">
            
                    < MdOutlineMobileFriendly  className='icon' size="100px" color='#3B3030'/>
                
            
                <h2 className= "Card-title"> Find Your Match</h2>
                <p>We help you connect to the users who might be interested in learning what you offer in exchange for what you can help them grow in. You can then make your decision. </p>
                
            </div>
            <div className ="Card">
                
                    <IoLogoWechat  className='icon' size="100px" color='#3B3030'  /> 
                
            
                <h2 className= "Card-title"> Coordinate with Your Matches!</h2>
                <p>You have complete control and flexibility. Decide how when to learn and teach your skills according to your comfort.</p>
                
            </div>
            
            
           
        </div>

        <h3> Come Join Us!</h3>
        <div className="list">
            
            <ul>
          <li>Find Your Own People</li>
          <li>Learn and Grow Together</li>
          <li>Make Your Own Rules and Have Fun!</li>
          <li>PS: It's Free ^_-</li>
        </ul>
            </div>
       </>
    );


  }
  
  export default About;
