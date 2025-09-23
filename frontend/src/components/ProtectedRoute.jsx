import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { useToast } from '../contexts/ToastContext';
import { getAuthService } from '../services/auth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this
  const toast = useToast();
  const authService = getAuthService(toast);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use profile endpoint instead of test/protected
        const profile = await authService.getProfile();
        setUserRole(profile.role);
        
        // Check if admin access is required
        if (adminOnly && profile.role !== 'admin') {
          setIsAuthenticated(false);
          toast.error('Admin access required');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        // Error is already handled by the service
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [adminOnly, toast]);

  if (loading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    if (adminOnly) {
      // Use React Router navigation instead of window.location
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;