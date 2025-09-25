import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // Add this to help with CORS preflight
    'Accept': 'application/json'
  }
});

// Enhanced error logging
api.interceptors.request.use(
  (config) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        cookies: document.cookie
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('Response:', {
        status: response.status,
        headers: response.headers,
        cookies: document.cookie
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Use proper navigation instead of window.location
      // Import and use navigate from react-router-dom
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;