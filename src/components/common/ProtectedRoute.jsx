import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext'; // Adjust path if needed
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Show a loading indicator while checking auth status
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page, saving the intended location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if the user's role is allowed for this route
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect to an unauthorized page or back to a default dashboard
        // For simplicity, redirecting to a generic dashboard or login
        console.warn(`User role '${user?.role}' not authorized for route requiring: ${allowedRoles.join(', ')}`);
        // Redirect to a default page based on their role, or a generic unauthorized page
        const defaultPath = user?.role === 'donor' ? '/donor-dashboard' : user?.role === 'hospital' ? '/hospital-dashboard' : '/authority-dashboard';
        return <Navigate to={defaultPath || '/login'} replace />;
        // Or: return <Navigate to="/unauthorized" replace />; (Create an Unauthorized page)
    }

    // If authenticated and authorized (or no specific roles required), render the child component
    return children;
};

export default ProtectedRoute;