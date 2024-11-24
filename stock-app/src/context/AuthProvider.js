import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuthData = localStorage.getItem("auth");
        console.log("Initial auth state from localStorage:", storedAuthData); // debugging
        return storedAuthData ? JSON.parse(storedAuthData) : null;
    });

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3001/auth/verify',
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    const { user } = response.data;
                    setAuth({ ...user });
                    localStorage.setItem("auth", JSON.stringify(user));
                    console.log("User is authenticated:", user);
                }
            } catch (err) {
                console.log("Session verification failed", err);
                setAuth(null);
                localStorage.removeItem("auth");
            }
        };

        verifySession();
    }, []);

    const logout = () => {
        setAuth(null);
        localStorage.removeItem("auth");
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;