import api from './api';
import { withErrorHandling } from '../utils/errorHandler';

const createAuthService = (toast) => {
  const withAuthErrorHandling = (fn) => withErrorHandling(fn, toast);

  return {
    login: withAuthErrorHandling(async (email, password) => {
      try {
        const response = await api.post('/api/auth/login/', { email, password });
        console.log('Login response:', {
          status: response.status,
          data: response.data,
          headers: response.headers,
          cookies: document.cookie
        });
        if (response.data) {
          localStorage.setItem('user', JSON.stringify({
            email: response.data.email,
            username: response.data.username,
            role: response.data.role
          }));
        }
        return response.data;
      } catch (error) {
        console.error('Login error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw error;
      }
    }),

    register: withAuthErrorHandling(async (userData) => {
      const response = await api.post('/api/auth/register/', userData);
      console.log('Register response:', response.data);
      return response.data;
    }),

    logout: withAuthErrorHandling(async () => {
      try {
        await api.post('/api/auth/logout/');
      } catch (error) {
        if (error.response?.status !== 401) {
          throw error;
        }
      } finally {
        localStorage.removeItem('user');
      }
    }),

    getProfile: withAuthErrorHandling(async () => {
      try {
        const response = await api.get('/api/user/profile/');
        console.log('Profile response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        return response.data;
      } catch (error) {
        console.error('Profile error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw error;
      }
    }),

    getProtectedData: withAuthErrorHandling(async () => {
      const response = await api.get('/api/test/protected/');
      return response.data;
    }),

    updateProfile: withAuthErrorHandling(async (profileData) => {
      const response = await api.put('/api/user/profile/', profileData);
      return response.data;
    }),

    changePassword: withAuthErrorHandling(async (passwordData) => {
      const response = await api.post('/api/user/change-password/', passwordData);
      return response.data;
    }),

    getLoginHistory: withAuthErrorHandling(async () => {
      const response = await api.get('/api/user/login-history/');
      return response.data;
    }),

    getAdminDashboard: withAuthErrorHandling(async () => {
      const response = await api.get('/api/admin/dashboard/');
      return response.data;
    }),

    getUsers: withAuthErrorHandling(async (params = {}) => {
      const response = await api.get('/api/admin/users/', { params });
      return response.data;
    }),

    getUser: withAuthErrorHandling(async (userId) => {
      const response = await api.get(`/api/admin/users/${userId}/`);
      return response.data;
    }),

    createUser: withAuthErrorHandling(async (userData) => {
      const response = await api.post('/api/admin/users/create/', userData);
      return response.data;
    }),

    updateUser: withAuthErrorHandling(async (userId, userData) => {
      const response = await api.put(`/api/admin/users/${userId}/`, userData);
      return response.data;
    }),

    deleteUser: withAuthErrorHandling(async (userId) => {
      const response = await api.delete(`/api/admin/users/${userId}/`);
      return response.data;
    }),

    getLoginActivities: withAuthErrorHandling(async (params = {}) => {
      const response = await api.get('/api/admin/login-activities/', { params });
      return response.data;
    })
  };
};

export const getAuthService = (toast) => createAuthService(toast);
export const authService = {};
export const initAuthService = (toast) => {
  Object.assign(authService, createAuthService(toast));
};