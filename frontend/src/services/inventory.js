// API URLs
const API_URL = 'http://localhost:5000/api';
const INVENTORY_URL = `${API_URL}/inventory`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

// Get all blood inventory items
export const getAllInventory = async (token, filters = {}) => {
  // Convert filters object to query string
  const queryString = new URLSearchParams(filters).toString();
  const url = queryString ? `${INVENTORY_URL}?${queryString}` : INVENTORY_URL;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Get inventory for a specific hospital
export const getHospitalInventory = async (token, hospitalId) => {
  const response = await fetch(`${INVENTORY_URL}/hospital/${hospitalId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Get inventory summary across all hospitals
export const getInventorySummary = async (token) => {
  const response = await fetch(`${INVENTORY_URL}/summary`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Add new blood inventory item
export const addInventoryItem = async (token, inventoryData) => {
  const response = await fetch(INVENTORY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(inventoryData),
  });

  return handleResponse(response);
};

// Update blood inventory
export const updateInventoryItem = async (token, itemId, inventoryData) => {
  const response = await fetch(`${INVENTORY_URL}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(inventoryData),
  });

  return handleResponse(response);
};

// Delete blood inventory item
export const deleteInventoryItem = async (token, itemId) => {
  const response = await fetch(`${INVENTORY_URL}/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};