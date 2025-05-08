// API URLs
const API_URL = 'http://localhost:5000/api';
const AUTH_URL = `${API_URL}/auth`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

// Register a new user
export const register = async (userData) => {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

// Login a user
export const login = async (email, password) => {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

// Get current user profile
export const getCurrentUser = async (token) => {
  const response = await fetch(`${AUTH_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Refresh access token using refresh token
export const refreshToken = async (refreshToken) => {
  const response = await fetch(`${AUTH_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  return handleResponse(response);
};

// Logout (client-side only)
export const logout = () => {
  // Remove tokens from local storage
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken; // Returns true if access token exists
};