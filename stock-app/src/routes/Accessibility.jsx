import React from 'react';
import style from './style/accessibility.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Accessibility = () => {
    return (
        <>
            <NavBar />
            <div className={style.accessibilitySection}>
                <h1>TSC Accessibility Help</h1>
                <p>
                TSC strives to provide individuals with disabilities access to its products and services, including through an accessible website. 
                If you have questions, comments, or encounter any difficulty in using this site, please e-mail Milk@uw.edu or call (253) 366-1473.
                </p>
            </div>
            <Footer />
        </>
    )
}

export default Accessibility