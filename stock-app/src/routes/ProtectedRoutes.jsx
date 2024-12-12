import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';

export const ProtectedRoutes = () => {
    const [auth, setAuth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/auth/verify",
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setAuth(response.data.user)
                }
            } catch (err) {
                setAuth(null);
            }
            setIsLoading(false);
        };

        verifySession();
    }, [setAuth]);
    if (isLoading) {
        return null;
    }
    if (!auth) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}
