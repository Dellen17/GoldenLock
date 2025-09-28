import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useToast } from './contexts/ToastContext';
import { initAuthService } from './services/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import UserForm from './pages/UserForm';
import LoginActivities from './pages/LoginActivities';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const toast = useToast();
  
  // Initialize auth service with toast
  initAuthService(toast);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/create" 
            element={
              <ProtectedRoute adminOnly={true}>
                <UserForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/edit/:id" 
            element={
              <ProtectedRoute adminOnly={true}>
                <UserForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/login-activities" 
            element={
              <ProtectedRoute adminOnly={true}>
                <LoginActivities />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;