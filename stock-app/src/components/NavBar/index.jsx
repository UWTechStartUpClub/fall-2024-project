import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/universal-wealth-logo-main.png'

import "./index.css"

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);
    const burgerRef = useRef(null);

    const toggleMenu = () => {
        console.log(isOpen);
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                navRef.current
                && !navRef.current.contains(event.target)
                && burgerRef.current
                && !burgerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleResize = () => {
            setIsOpen(false);
        }

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            const timeoutId = setTimeout(() => {
            document.body.style.overflow = 'auto';
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);


    return (
        console.log(isOpen),
        <nav className='navbar'>
            <Link className='logo' to='/'>
                <img src={logo} alt="logo" />
            </Link>
            <div id='nav-links' ref={navRef} className={isOpen ? 'active' : ''}>
                <div id='link-container'>
                    <Link className='link-style' to={'/about'}>About</Link>
                    <Link className='link-style' to={'/stocks'}>Stocks</Link>
                    <Link className='link-style' to={'/contact'}>Contact</Link>
                    <Link className='link-style' to={'/search'}>Find Stocks</Link> {/* Should this only be visible when logged in? */}
                    <Link className='link-style' to={'/login'}>Login</Link>
                    {/* If user in session this will be displayed otherwise login */}
                    <Link className='link-style' to={'/profile/:userId'}>Profile</Link>
                </div>
            </div>
            <div id='burger' ref={burgerRef} onClick={toggleMenu}>
                <i id="bar" className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
        </nav>
    )
}

export default NavBar