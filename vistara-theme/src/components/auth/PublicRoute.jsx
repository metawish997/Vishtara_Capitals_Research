import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // Or a loader
    }

    // If user is already logged in, redirect them away from auth pages
    if (user) {
        return <Navigate to={(user.role === 'admin' || user.role === 'superadmin' || user.role === 'super admin') ? '/admin/dashboard' : '/portal'} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
