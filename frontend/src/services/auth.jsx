import api from './api';
import { withErrorHandling } from '../utils/errorHandler';

// Create enhanced functions with error handling
const createAuthService = (toast) => {
  const withAuthErrorHandling = (fn) => withErrorHandling(fn, toast);

  return {
    // Login user
    login: withAuthErrorHandling(async (email, password) => {
      const response = await api.post('/auth/login/', { email, password });
      
      // Store user data in localStorage
      if (response.data) {
        localStorage.setItem('user', JSON.stringify({
          email: response.data.email,
          username: response.data.username,
          role: response.data.role
        }));
      }
      
      return response.data;
    }),

    // Register user
    register: withAuthErrorHandling(async (userData) => {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    }),

    // Logout user
    logout: withAuthErrorHandling(async () => {
      try {
        await api.post('/auth/logout/');
      } catch (error) {
        // Ignore 401 errors during logout
        if (error.response?.status !== 401) {
          throw error;
        }
      } finally {
        // Always clear local storage
        localStorage.removeItem('user');
      }
    }),

    // Get protected data (test endpoint)
    getProtectedData: withAuthErrorHandling(async () => {
      const response = await api.get('/test/protected/');
      return response.data;
    }),

    // Get user profile
    getProfile: withAuthErrorHandling(async () => {
      const response = await api.get('/user/profile/');
      return response.data;
    }),

    // Update user profile
    updateProfile: withAuthErrorHandling(async (profileData) => {
      const response = await api.put('/user/profile/', profileData);
      return response.data;
    }),

    // Change password
    changePassword: withAuthErrorHandling(async (passwordData) => {
      const response = await api.post('/user/change-password/', passwordData);
      return response.data;
    }),

    // Get user's login history
    getLoginHistory: withAuthErrorHandling(async () => {
      const response = await api.get('/user/login-history/');
      return response.data;
    }),

    // Get admin dashboard data
    getAdminDashboard: withAuthErrorHandling(async () => {
      const response = await api.get('/admin/dashboard/');
      return response.data;
    }),

    // Admin user management
    getUsers: withAuthErrorHandling(async (params = {}) => {
      const response = await api.get('/admin/users/', { params });
      return response.data;
    }),

    getUser: withAuthErrorHandling(async (userId) => {
      const response = await api.get(`/admin/users/${userId}/`);
      return response.data;
    }),

    createUser: withAuthErrorHandling(async (userData) => {
      const response = await api.post('/admin/users/create/', userData);
      return response.data;
    }),

    updateUser: withAuthErrorHandling(async (userId, userData) => {
      const response = await api.put(`/admin/users/${userId}/`, userData);
      return response.data;
    }),

    deleteUser: withAuthErrorHandling(async (userId) => {
      const response = await api.delete(`/admin/users/${userId}/`);
      return response.data;
    }),

    // Admin login activities
    getLoginActivities: withAuthErrorHandling(async (params = {}) => {
      const response = await api.get('/admin/login-activities/', { params });
      return response.data;
    })
  };
};

// Export a function that returns the auth service with toast
export const getAuthService = (toast) => createAuthService(toast);

// Default export for backward compatibility
export const authService = {
  // This will be populated when used with toast context
};

// Helper to initialize authService with toast
export const initAuthService = (toast) => {
  Object.assign(authService, createAuthService(toast));
};