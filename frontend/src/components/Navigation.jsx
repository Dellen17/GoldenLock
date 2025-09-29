import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = ({ userRole, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="nav-container" ref={navRef}>
      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className="nav-brand"
          onClick={closeMenus}
        >
          GoldenLock
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Profile
          </Link>
          
          {userRole === 'admin' && (
            <Link 
              to="/admin" 
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={closeMenus}
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      <div className={`nav-user-section`}>
        <span className="nav-user-info">
          {userRole === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
        <button 
          onClick={onLogout}
          className="nav-logout-btn"
        >
          Logout
        </button>
      </div>

      {/* Mobile-only logout as last item in dropdown */}
      {isMenuOpen && (
        <button 
          onClick={() => { closeMenus(); onLogout(); }}
          className="nav-logout-btn mobile-logout"
        >
          Logout
        </button>
      )}

      <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navigation;