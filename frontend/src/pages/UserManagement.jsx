import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getAuthService } from '../services/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import Navigation from '../components/Navigation';

const UserManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const authService = getAuthService(toast);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const usersData = await authService.getUsers(params);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(
        error.response?.status === 500
          ? 'Server error occurred while fetching users'
          : error.response?.data?.detail || 'Failed to load users'
      );
      setUsers([]); // Clear users on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers({
      search: searchTerm?.trim(),
      role: roleFilter !== 'all' ? roleFilter : undefined,
      active: statusFilter !== 'all' ? statusFilter === 'active' : undefined
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    fetchUsers();
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user: ${email}?`)) {
      return;
    }

    try {
      await authService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast.success(`User ${email} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
    return <LoadingSpinner text="Loading users..." />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navigation userRole="admin" onLogout={handleLogout} />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2c3e50' }}>👥 User Management</h1>
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
            + Add New User
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

        {/* Search and Filter Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Search & Filter</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email or username"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Role:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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

        {/* Users Table */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
            Users ({users.length} found)
          </h3>
          
          {users.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Username</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Joined</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{ borderBottom: index === users.length - 1 ? 'none' : '1px solid #dee2e6' }}>
                      <td style={{ padding: '0.75rem' }}>{user.email}</td>
                      <td style={{ padding: '0.75rem' }}>{user.username || 'Not set'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ 
                          color: user.role === 'admin' ? '#e74c3c' : '#3498db',
                          fontWeight: 'bold'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ 
                          color: user.is_active ? '#28a745' : '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(user.created_at)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              <p>No users found matching your criteria.</p>
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

export default UserManagement;