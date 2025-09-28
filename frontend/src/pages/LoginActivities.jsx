import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getAuthService } from '../services/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import Navigation from '../components/Navigation';

const LoginActivities = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const authService = getAuthService(toast);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      const activitiesData = await authService.getLoginActivities(params);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching login activities:', error);
      setError(
        error.response?.status === 500
          ? 'Server error occurred while fetching login activities'
          : error.response?.data?.detail || 'Failed to load login activities'
      );
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = {};
    
    if (userFilter.trim()) {
      params.user_id = userFilter.trim();
    }
    
    if (startDate) {
      params.start_date = startDate;
    }
    
    if (endDate) {
      params.end_date = endDate;
    }
    
    fetchActivities(params);
  };

  const handleReset = () => {
    setUserFilter('');
    setStartDate('');
    setEndDate('');
    fetchActivities();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading login activities..." />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navigation userRole="admin" onLogout={handleLogout} />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2c3e50' }}>🔐 Login Activities</h1>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Admin Dashboard
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '2rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Filter Activities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>User ID:</label>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Enter user ID"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={handleSearch}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Activities Table */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
            Login Activities ({activities.length} found)
          </h3>
          
          {activities.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>User Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Username</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>IP Address</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity.id} style={{ borderBottom: index === activities.length - 1 ? 'none' : '1px solid #dee2e6' }}>
                      <td style={{ padding: '0.75rem' }}>{activity.user_email}</td>
                      <td style={{ padding: '0.75rem' }}>{activity.username || 'Not set'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ 
                          fontFamily: 'monospace',
                          backgroundColor: '#f8f9fa',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '3px',
                          fontSize: '0.875rem'
                        }}>
                          {activity.ip_address}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(activity.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              <p>No login activities found matching your criteria.</p>
              <button
                onClick={handleReset}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginActivities;
