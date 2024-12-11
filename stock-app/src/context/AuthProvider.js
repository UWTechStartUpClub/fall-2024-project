import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/auth/verify",
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    const { user } = response.data;
                    setAuth(user);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    console.log("Session verification endpoint not found.");
                } else {
                    console.log("Session verification failed", err);
                }
                setAuth(null);
            }
        };

        verifySession();
    }, []);

    const logout = () => {
        setAuth(null);
        console.log("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;