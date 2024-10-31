import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/official logo.png'

import "./index.css"

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(isOpen => !isOpen);
    };
    return (
        <nav className='navbar'>
            <Link className='logo' to='/'>
                <img src={logo} alt="logo" />
            </Link>
            {/* use js and disable me! my transition is ugly https://nextui.org/docs/components/navbar */}
            <div id='nav-links' className={isOpen ? "#nav-links" : "#nav-links active"}>
                <Link className='link-style' to={'/'}>About</Link>
                <Link className='link-style' to={'/'}>Stocks</Link>
                <Link className='link-style' to={'/'}>Contact</Link>
                <Link className='link-style' to={'/'}>Login</Link>
            </div>
            <div id='burger' onClick={toggleMenu}>
                <i id="bar" className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
        </nav>
    )
}

export default NavBar