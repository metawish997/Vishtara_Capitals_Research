import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { canAccess, hasPermission } from '../../utils/rbac';

const ProtectedRoute = ({ allowedRoles, requiredLevel, requiredPermission }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F8FC]">
                <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredLevel) {
        if (!canAccess(user, requiredLevel)) {
            return <Navigate to="/" replace />;
        }
        return <Outlet />;
    }

    if (requiredPermission) {
        if (!hasPermission(user, requiredPermission)) {
            return <Navigate to="/" replace />;
        }
        return <Outlet />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'super admin' || user.role === 'super_admin') {
            return <Outlet />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
