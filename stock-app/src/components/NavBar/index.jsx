import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';  // Updated import path
import logo from '../../assets/images/universal-wealth-logo-main.png';
import "./index.css";

const NavBar = () => {
    const { auth } = useContext(AuthContext);  // This stays the same since your context object is still named AuthContext
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navRef = useRef(null);
    const burgerRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/stock/${searchQuery.trim().toUpperCase()}?function=TIME_SERIES_DAILY`);
            setSearchQuery('');
        } else {
            navigate('/stocks');
        }
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
        };

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.addEventListener("resize", handleResize);
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
        <nav className='navbar'>
            <div className="nav-left">
                <Link className='logo' to='/'>
                    <img src={logo} alt="logo" />
                </Link>
                <div className="search-container">
                    <form onSubmit={handleSearch} style={{width: '100%', margin: 0}}>
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search stocks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            <div id='nav-links' ref={navRef} className={isOpen ? 'active' : ''}>
                <div id='link-container'>
                    <Link className='link-style' to={'/stocks'}>Stocks</Link>
                    <Link className='link-style' to={'/crypto'}>Crypto</Link>
                    <Link className='link-style' to={'/about'}>About</Link>
                    <Link className='link-style' to={'/contact'}>Contact</Link>
                    <Link className='link-style' to={'/UserProfile'}>Profile</Link>
                    {!auth && (
                        <Link className='link-style login-button' to={'/login'}>Login</Link>
                    )}
                </div>
            </div>
            <div id='burger' ref={burgerRef} onClick={toggleMenu}>
                <i id="bar" className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
        </nav>
    );
};

export default NavBar;