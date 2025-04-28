import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/Authcontext'
import './index.css'
// Page Imports
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // Import SignupPage
import DonorDashboardPage from './pages/DonorDashboardPage';
import HospitalDashboardPage from './pages/HospitalDashboardPage';
import AuthorityDashboardPage from './pages/AuthorityDashboardPage'; // Assume exists
import AlertsPage from './pages/AlertsPage'; // Assume exists
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import SettingsPage from './pages/SettingsPage'; // Assume exists
// Add other page imports like MyDonations, Rewards, etc.

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute'; // Adjust path
import MainLayout from './components/common/MainLayout'; // Needed for protected pages

// A simple wrapper to apply MainLayout to protected routes easily
const ProtectedLayout = ({ children }) => (
  <MainLayout>{children}</MainLayout>
);

// Component to determine the default redirect path based on role
const DefaultRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.role) {
    case 'donor':
      return <Navigate to="/donor-dashboard" replace />;
    case 'hospital':
      return <Navigate to="/hospital-dashboard" replace />;
    case 'authority':
      return <Navigate to="/authority-dashboard" replace />;
    default:
      // Fallback if role is unknown or not set, go to login
      return <Navigate to="/login" replace />;
  }
};


function App() {
  return (
    <AuthProvider> {/* Wrap everything in AuthProvider */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        {/* Wrap protected page elements within ProtectedRoute */}

        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <ProtectedLayout>
                <DonorDashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-dashboard"
          element={


            <HospitalDashboardPage />


          }
        />
        <Route
          path="/authority-dashboard"
          element={
            <ProtectedRoute allowedRoles={['authority']}>
              <ProtectedLayout>
                <AuthorityDashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Routes accessible by multiple logged-in roles */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute allowedRoles={['donor', 'hospital']}> {/* Example */}
              <ProtectedLayout>
                <AlertsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute> {/* Allow any logged-in user */}
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute> {/* Allow any logged-in user */}
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes for MyDonations, Rewards, etc. following the pattern */}






        {/* Default Route Handler */}
        <Route path="/" element={<DefaultRedirect />} />

        {/* Catch-all for unmatched routes (optional: create a 404 page) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;

// NOTE: Remember to create the actual page components:
// AuthorityDashboardPage, AlertsPage, SettingsPage etc.