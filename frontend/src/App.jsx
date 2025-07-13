/**
 * App entry for Job Application Tracker (context version).
 * Uses global context for user/auth state.
 */
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationForm from './pages/ApplicationForm';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { useAppContext } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  const { user, dispatch } = useAppContext();
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState('');

  // Toggle dark mode by adding/removing class on html
  const handleToggleDark = useCallback(() => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  // Show toast notification
  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  // Auth guard for protected routes
  const AuthRoute = ({ children }) =>
    user ? children : <Navigate to="/login" replace />;

  // Handle logout using context
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('Logged out!');
  };

  // Handle application save (mock)
  const handleAppSave = () => {
    showToast('Application saved!');
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} onToggleDark={handleToggleDark} />
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="pt-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/applications" element={<AuthRoute><Applications /></AuthRoute>} />
          <Route path="/applications/new" element={<AuthRoute><ApplicationForm onSave={handleAppSave} /></AuthRoute>} />
          <Route path="/applications/:id" element={<AuthRoute><ApplicationForm isEdit={true} onSave={handleAppSave} /></AuthRoute>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
