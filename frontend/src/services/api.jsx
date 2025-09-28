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
  response => response,
  error => {
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    return Promise.reject(error);
  }
);

export default api;