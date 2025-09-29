import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getAuthService } from '../services/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import Navigation from '../components/Navigation';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const authService = getAuthService(toast);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashboardData, users, logins] = await Promise.all([
          authService.getAdminDashboard(),
          authService.getUsers({ ordering: '-created_at' }),
          authService.getLoginActivities({ ordering: '-timestamp' })
        ]);

        setStats(dashboardData);
        setRecentUsers(users.slice(0, 5));
        setRecentLogins(logins.slice(0, 10));
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
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
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navigation userRole="admin" onLogout={handleLogout} />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>👑 Admin Dashboard</h1>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid-responsive" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{stats.total_users}</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Total Users</p>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{stats.total_admins}</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Admins</p>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{stats.total_regular_users}</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Regular Users</p>
            </div>
          </div>
        )}

        <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Recent Users */}
          <div className="card-mobile" style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Recent Users</h3>
            {recentUsers.length > 0 ? (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, index) => (
                      <tr key={user.id} style={{ borderBottom: index === recentUsers.length - 1 ? 'none' : '1px solid #dee2e6' }}>
                        <td style={{ padding: '0.75rem' }}>{user.email}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ 
                            color: user.role === 'admin' ? '#e74c3c' : '#3498db',
                            fontWeight: 'bold'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{formatDate(user.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#6c757d', textAlign: 'center' }}>No users found</p>
            )}
          </div>

          {/* Recent Login Activities */}
          <div className="card-mobile" style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Recent Login Activities</h3>
            {recentLogins.length > 0 ? (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>User</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>IP Address</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogins.map((login, index) => (
                      <tr key={login.id} style={{ borderBottom: index === recentLogins.length - 1 ? 'none' : '1px solid #dee2e6' }}>
                        <td style={{ padding: '0.75rem' }}>{login.user_email}</td>
                        <td style={{ padding: '0.75rem' }}>{login.ip_address}</td>
                        <td style={{ padding: '0.75rem' }}>{formatDate(login.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#6c757d', textAlign: 'center' }}>No login activities found</p>
            )}
          </div>
        </div>

            {/* Quick Actions */}
<div style={{ 
  backgroundColor: 'white', 
  padding: '1.5rem', 
  borderRadius: '8px', 
  marginTop: '2rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>
  <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Quick Actions</h3>
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <button
      onClick={() => navigate('/admin/users')}
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Manage Users
    </button>
    <button
      onClick={() => navigate('/admin/users/create')}
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Create New User
    </button>
    <button
      onClick={() => navigate('/admin/login-activities')}
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      View Login Activities
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default AdminDashboard;