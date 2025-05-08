import { useContext } from 'react';
import { AuthContext } from '../contexts/Authcontext';

// This hook provides an easy way to access the auth context
// throughout the application
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;