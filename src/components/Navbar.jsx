import React from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = ({ isAuthenticated }) => {
    const [openLinks, setOpenLinks] = useState(false);
    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    // Define links based on authentication status
    const links = isAuthenticated
        ? [
            { to: '/message', label: 'Message' },
            { to: '/search', label: 'Search' },
            { to: '/profile', label: 'Profile' }
          ]
        : [
            { to: '/sign-up', label: 'Sign Up' },
            { to: '/', label: 'Home' },
            { to: '/how-it-works', label: 'How it works' }
          ];

    return (
        <div className='navbar'>
            <div className='leftSide'>
                <h1>SWAP'em.</h1>
                <div className={`hiddenLinks ${openLinks ? "open" : ""}`}>
                    {links.map((link, index) => (
                        <Link key={index} to={link.to}>{link.label}</Link>
                    ))}
                </div>
            </div>
            <div className='rightSide'>
                <div className='toggleButton' onClick={toggleNavbar} aria-label="Toggle navigation">
                    {openLinks ? <AiOutlineClose /> : <AiOutlineMenu />}
                </div>
                <div className={`hiddenLinks ${openLinks ? "open" : ""}`}>
                    {links.map((link, index) => (
                        <Link key={index} to={link.to}>{link.label}</Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
