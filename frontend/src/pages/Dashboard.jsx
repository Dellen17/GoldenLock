import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getAuthService } from '../services/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const authService = getAuthService(toast);
  const [userData, setUserData] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profile = await authService.getProfile();
        setUserData(profile);

        const history = await authService.getLoginHistory();
        setLoginHistory(history);

        if (profile.role === 'admin') {
          const adminDashboardData = await authService.getAdminDashboard();
          setAdminData(adminDashboardData);
        }
      } catch (error) {
        // Error is handled by error handler utility
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navigation userRole={userData?.role} onLogout={handleLogout} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* User Information Card */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>User Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Email:</strong> {userData?.email}
            </div>
            <div>
              <strong>Username:</strong> {userData?.username || 'Not set'}
            </div>
            <div>
              <strong>Role:</strong> <span style={{ 
                color: userData?.role === 'admin' ? '#e74c3c' : '#3498db',
                fontWeight: 'bold'
              }}>
                {userData?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Section (only for admin users) */}
        {userData?.role === 'admin' && adminData && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #e74c3c'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>👑 Admin Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h3 style={{ margin: '0', color: '#2c3e50' }}>{adminData.total_users}</h3>
                <p style={{ margin: '0', color: '#6c757d' }}>Total Users</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h3 style={{ margin: '0', color: '#2c3e50' }}>{adminData.total_admins}</h3>
                <p style={{ margin: '0', color: '#6c757d' }}>Admins</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h3 style={{ margin: '0', color: '#2c3e50' }}>{adminData.total_regular_users}</h3>
                <p style={{ margin: '0', color: '#6c757d' }}>Regular Users</p>
              </div>
            </div>
          </div>
        )}

        {/* Login History Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Login History</h2>
          {loginHistory.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>IP Address</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((login, index) => (
                    <tr key={login.id} style={{ borderBottom: index === loginHistory.length - 1 ? 'none' : '1px solid #dee2e6' }}>
                      <td style={{ padding: '0.75rem' }}>{login.ip_address}</td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(login.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6c757d', textAlign: 'center' }}>No login history found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;