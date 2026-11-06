/**
 * StudentAI Centralized API Client
 * Configurable base URL with JWT authentication header management and standardized error handling.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${cleanEndpoint}`;
};

export const getStoredToken = () => {
  return localStorage.getItem('studentai_token');
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('studentai_token', token);
  } else {
    localStorage.removeItem('studentai_token');
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem('studentai_token');
  localStorage.removeItem('studentai_user');
  localStorage.removeItem('studentai_role');
  localStorage.removeItem('studentai_university');
};

/**
 * Standard HTTP request wrapper with timeout and error extraction
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const url = getApiUrl(endpoint);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const error = new Error(data?.message || `HTTP ${response.status}: Request failed`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Connection timed out. Please check if the backend server is running on port 5000.');
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw error;
  }
};

export default apiClient;

