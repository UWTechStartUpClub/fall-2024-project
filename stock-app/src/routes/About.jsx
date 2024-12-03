import React from 'react';
import style from './style/about.module.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// Import images manually because there is no direct refrence 
import celestin from '../assets/images/Profile-Photos/celestin.jpeg';
import jacobKlymenko from '../assets/images/Profile-Photos/jacobKylmenko.jpeg';
import nickJordan from '../assets/images/Profile-Photos/nickJordan.jpeg';
import primoBambao from '../assets/images/Profile-Photos/primoBambao.jpeg';
import prestonSia from '../assets/images/Profile-Photos/prestonSia.jpeg';
import fernandoOlivarNeri from '../assets/images/Profile-Photos/fernandoOlivarNeri.jpeg';
import alexYu from '../assets/images/Profile-Photos/alexYu.jpg';
import johnDiego from '../assets/images/Profile-Photos/johnDiego.jpeg';

//add more team members if needed here
const teamMembers = [
    { name: 'Celestin Ryf', img: celestin, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' },
    { name: 'Jacob Klymenko', img: jacobKlymenko, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' },
    { name: 'Nick Jordan', img: nickJordan, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' },
    { name: 'Primo Bambao', img: primoBambao, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' },
    { name: 'Preston Sia', img: prestonSia, description: 'Hi there! I am an undergraduate student at the University of Washington Tacoma studying computer science. Programming is a passion of mine, one that started with the coding of a few simple web pages, and grew into the drive that brought me to this field and this project. I believe in the power of technology to make change in our communities for the better.' },
    { name: 'Fernando Olivar Neri', img: fernandoOlivarNeri, description: 'Computer Science student at the University of Washington Tacoma skilled in Java, Python, JavaScript, and C. Passionate about software development and cybersecurity, I’m eager to contribute to impactful projects and grow in the tech industry.' },
    { name: 'Alex Yu', img: alexYu, description: 'You are my sunshine, my only sunshine...' },
    { name: 'John Diego', img: johnDiego, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...' },
    
];

const About = () => {
    return (
        <>
            <NavBar />
            <div className={style.container}>
                <div className={style.aboutSection}>
                    <h1>About Us</h1>
                    <p>
                        We are a group of students at the University of Washington Tacoma, passionate about combining techonology and finance to create impactful solutions. 
                        Our current project is developing a stock tracker app designed to empower users with real time market insights, personalized portfolio tracking, 
                        and educational resources for smarter investing. With diverse backgrounds in coding, finance, and user experience design, we aim to create an intuitive 
                        and accessible platform that meets the needs of modern investors. At UWT, we are proud to foster innovation and collaboration, turning ideas into tools 
                        that make a difference.
                    </p>
                 </div>

                 <section className={style.teamSection}>
                    <h1>Our Team</h1>
                    <div className={style.teamGrid}>
                        {teamMembers.map((member, index) => (
                            <div key={index} className={style.teamCard}>
                                <img
                                src={member.img} 
                                alt={`Profile of ${member.name}`}
                                className={style.profileImage}
                                />
                                <h2>{member.name}</h2>
                                <p>{member.description}</p>
                            </div>
                        ))}
                    </div>
                 </section>
            </div>
            <Footer />
        </>
    );
} 

export default About