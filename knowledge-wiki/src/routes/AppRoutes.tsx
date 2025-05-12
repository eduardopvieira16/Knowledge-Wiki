import useAuth from '@/context/useAuth';
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AppRoutes: React.FC = () => {
    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AppRoutes;
