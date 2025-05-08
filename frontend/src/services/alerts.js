// API URLs
const API_URL = 'http://localhost:5000/api';
const ALERTS_URL = `${API_URL}/alerts`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

// Get all alerts (with optional filters)
export const getAlerts = async (token, filters = {}) => {
  // Convert filters object to query string
  const queryString = new URLSearchParams(filters).toString();
  const url = queryString ? `${ALERTS_URL}?${queryString}` : ALERTS_URL;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Get a specific alert by ID
export const getAlert = async (token, alertId) => {
  const response = await fetch(`${ALERTS_URL}/${alertId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Create a new blood request alert
export const createAlert = async (token, alertData) => {
  const response = await fetch(ALERTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  });

  return handleResponse(response);
};

// Update an alert
export const updateAlert = async (token, alertId, alertData) => {
  const response = await fetch(`${ALERTS_URL}/${alertId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  });

  return handleResponse(response);
};

// Resolve an alert
export const resolveAlert = async (token, alertId) => {
  const response = await fetch(`${ALERTS_URL}/${alertId}/resolve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Delete an alert
export const deleteAlert = async (token, alertId) => {
  const response = await fetch(`${ALERTS_URL}/${alertId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Get nearby alerts based on location
export const getNearbyAlerts = async (token, latitude, longitude, radius = 20) => {
  const queryString = new URLSearchParams({
    latitude,
    longitude,
    radius
  }).toString();

  const response = await fetch(`${ALERTS_URL}/nearby?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};