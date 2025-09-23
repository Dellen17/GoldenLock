import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = ({ userRole, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link 
          to="/dashboard" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.5rem', 
            fontWeight: 'bold' 
          }}
        >
          GoldenLock
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            to="/dashboard" 
            style={{ 
              color: isActive('/dashboard') ? '#3498db' : 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Dashboard
          </Link>
          
          {/* Add Profile Link */}
          <Link 
            to="/profile" 
            style={{ 
              color: isActive('/profile') ? '#3498db' : 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: isActive('/profile') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Profile
          </Link>
          
          {userRole === 'admin' && (
            <Link 
              to="/admin" 
              style={{ 
                color: isActive('/admin') ? '#3498db' : 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: isActive('/admin') ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'white' }}>
          {userRole === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
        <button 
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;