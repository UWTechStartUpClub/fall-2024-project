import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../context/AuthProvider"

export const ProtectedRoutes = () => {
    const { auth } = useAuth();

    if (!auth) {
        return <Navigate to="/login"/>;
    }

    return <Outlet/>;
};