import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request debugging
api.interceptors.request.use(request => {
  if (import.meta.env.DEV) {
    console.log('Request:', {
      url: request.url,
      method: request.method,
      withCredentials: request.withCredentials,
      headers: request.headers
    });
  }
  return request;
});

// Add response debugging
api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log('Response:', {
        status: response.status,
        headers: response.headers,
        cookies: document.cookie
      });
    }
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Use proper navigation instead of window.location
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;