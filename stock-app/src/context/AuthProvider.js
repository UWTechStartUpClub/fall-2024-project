import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    const login = (email, password, accessToken, refreshToken) => {
        setAuth({
            email,
            password,
            accessToken,
            refreshToken,
        });
    };

    const logout = () => {
        setAuth(null);
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;