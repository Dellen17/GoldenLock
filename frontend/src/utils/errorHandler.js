import { authService } from '../services/auth';

export const handleApiError = (error, toast) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        toast.error(data.detail || 'Invalid request');
        break;
      case 401:
        toast.error('Session expired. Please login again.');
        // Optionally redirect to login
        break;
      case 403:
        toast.error('Permission denied');
        break;
      default:
        toast.error('An error occurred. Please try again.');
    }
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred.');
  }

  // Instead of logging the full error, log only non-sensitive info if needed
  if (process.env.NODE_ENV === 'development') {
    // Log only status code and message in development
    const logInfo = {
      status: error.response?.status,
      message: error.message
    };
    console.warn('API Error:', logInfo);
  }
};

export const withErrorHandling = (fn, toast) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, toast);
      throw error; // Re-throw for component-level handling
    }
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return null;
};