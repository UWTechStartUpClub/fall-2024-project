import { useRef, useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import './index.css';

const LOGIN_URL = 'http://localhost:3000/auth/login'; // while in development

const Login = () => {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const errRef = useRef();

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, pwd)

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log("API response:", response);

            if (response.status === 200) {
                // If login is successful, set success state and reset form fields
                setEmail('');
                setPwd('');
                setSuccess(true);
            } else {
                setErrMsg('Login failed');
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized: Incorrect email or password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <div className="formPage">
            {success ? (
                <section className="formSection">
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <Link to="/">Go to Home</Link>
                    </p>
                </section>
            ) : (
                <section className="formSection">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Login</button>
                    </form>
                    <p>
                        Need an account?<br />
                        <span className="line">
                            <Link to="/register">Register</Link>
                        </span>
                    </p>
                </section>
            )}
        </div>
    );
};

export default Login;
