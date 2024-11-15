import React from 'react';
import style from './style/home.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const About = () => {

    return (
        <>
            <NavBar />
            <div className={style.aboutParagraph}>
                <span>
                    About
                </span>
            </div>
            <Footer />
        </>
    )
}

export default About