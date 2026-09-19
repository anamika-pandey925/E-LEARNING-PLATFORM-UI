// Centralized API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal request wrapper handling JWT auth headers, JSON payloads, and error parsing
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('study_point_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend connection fails (e.g. offline/network), log and rethrow for graceful UI fallback
    console.warn(`[API Request Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

export default apiRequest;
