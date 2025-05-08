import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/Authcontext'
import './index.css'
// Page Imports
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import HospitalDashboardPage from './pages/HospitalDashboardPage';
import AuthorityDashboardPage from './pages/AuthorityDashboardPage';
import AlertsPage from './pages/AlertsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
// Add other page imports like MyDonations, Rewards, etc.

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/common/MainLayout';

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
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        {/* Donor Dashboard */}
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
        
        {/* Hospital Dashboard - Fixed to match other protected routes pattern */}
        <Route
          path="/hospital-dashboard"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <ProtectedLayout>
                <HospitalDashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Authority Dashboard */}
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
            <ProtectedRoute allowedRoles={['donor', 'hospital']}>
              <ProtectedLayout>
                <AlertsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes for MyDonations, Rewards, etc. following the pattern */}

        {/* Default Route Handler */}
        <Route path="/" element={<DefaultRedirect />} />

        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;