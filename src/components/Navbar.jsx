import React from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";


const Navbar = () => {
    const [openLinks, setOpenLinks] = useState(false);
    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    }
  return (
    <div className='navbar'>
        <div className='leftSide'  id={openLinks ? "open" : "close"}>
            <h1>SWAP'em.</h1>
            <div className='hiddenLinks'>
                <Link to='/'>Home</Link>
                <Link to="/About">How it works</Link>
                <Link to='sign-up'>Sign-up</Link>
            </div>
            
        </div>
        <div className='rightSide'>
            <Link to='/'>Home</Link>
            <Link to='/About'>How it works</Link>
            <Link to='sign-up'>Sign-up</Link>
            <div className='toggleButton' onClick={toggleNavbar}>
                {openLinks ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
        </div>
    </div>
  )
}

export default Navbar