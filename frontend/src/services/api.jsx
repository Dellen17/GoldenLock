import axios from 'axios';

   // Create axios instance with dynamic baseURL
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL, // Uses http://localhost:8000 in dev, https://goldenlock.onrender.com in prod
     withCredentials: true, // Crucial for httpOnly cookies
   });

   // Add request interceptor to include CSRF token if needed
   api.interceptors.request.use(
     (config) => {
       // You can add auth headers here if needed later
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );

   // Add response interceptor to handle common errors
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         // Redirect to login if unauthorized
         window.location.href = '/login';
       }
       return Promise.reject(error);
     }
   );

   export default api;