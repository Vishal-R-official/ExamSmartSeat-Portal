import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, currentUser } = useContext(AppContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser?.role === 'staff') {
        const staffAllowedRoutes = ['/admin/staff-portal', '/admin/student-welfare'];
        
        // If staff tries to access a path not explicitly allowed for staff, redirect them to staff portal
        if (!staffAllowedRoutes.some(route => location.pathname.startsWith(route))) {
            return <Navigate to="/admin/staff-portal" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
