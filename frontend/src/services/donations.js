// API URLs
const API_URL = 'http://localhost:5000/api';
const DONATIONS_URL = `${API_URL}/donations`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

// Get all donations (with optional filters)
export const getDonations = async (token, filters = {}) => {
  // Convert filters object to query string
  const queryString = new URLSearchParams(filters).toString();
  const url = queryString ? `${DONATIONS_URL}?${queryString}` : DONATIONS_URL;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Get a specific donation by ID
export const getDonation = async (token, donationId) => {
  const response = await fetch(`${DONATIONS_URL}/${donationId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Schedule a new donation
export const scheduleDonation = async (token, donationData) => {
  const response = await fetch(DONATIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(donationData),
  });

  return handleResponse(response);
};

// Update a donation (status, details, etc.)
export const updateDonation = async (token, donationId, donationData) => {
  const response = await fetch(`${DONATIONS_URL}/${donationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(donationData),
  });

  return handleResponse(response);
};

// Cancel a donation (for donors)
export const cancelDonation = async (token, donationId) => {
  return updateDonation(token, donationId, { status: 'cancelled' });
};

// Complete a donation (for hospitals)
export const completeDonation = async (token, donationId, medicalInfo = {}) => {
  return updateDonation(token, donationId, {
    status: 'completed',
    ...medicalInfo
  });
};