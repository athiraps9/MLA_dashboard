import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MLADashboard from './pages/MLADashboard';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import MLADetail from './pages/MLADetail';
import Profile from './pages/Profile';
import ComplaintPortal from './pages/ComplaintPortal';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import PADashboard from './pages/PADashboard'; // New
import UserDashboard from './pages/UserDashboard'; // New
import AdminProfile from './pages/AdminProfile'; // New
import ForgotPassword from './pages/ForgotPassword'; // Password Reset
import ResetPassword from './pages/ResetPassword'; // Password Reset
import PublicDashboard from './pages/PublicDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;

    // Role checks
    if (role) {
      if (role === 'admin' && user.role !== 'admin' && user.role !== 'mla') return <Navigate to="/" />;
      if (role === 'pa' && user.role !== 'pa' && user.role !== 'admin') return <Navigate to="/" />;
      if (role === 'public' && user.role !== 'public') return <Navigate to="/" />; // Or allow?
    }
    return children;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar user={user} onLogout={handleLogout} />
          <div style={{ flex: '1' }}>
            <Routes>
              {/* Landing only visible if NOT logged in, otherwise redirect to dashboard */}
              <Route path="/" element={!user ? <LandingPage /> : <Navigate to={user.role === 'public' ? '/user' : user.role === 'pa' ? '/pa' : '/admin'} />} />

              <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Public User Dashboard */}
              <Route path="/user" element={
                <ProtectedRoute role="public">
                  <PublicDashboard />
                </ProtectedRoute>
              } />

              <Route path="/complaints" element={
                <ProtectedRoute>
                  <ComplaintPortal />
                </ProtectedRoute>
              } />




              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Dashboard */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {
                <Route path="/admin/profile" element={
                  <ProtectedRoute role="admin">
                    <AdminProfile />
                  </ProtectedRoute>
                } />
              }

              {/* PA Dashboard */}
              <Route path="/pa" element={
                <ProtectedRoute role="pa">
                  <PADashboard />
                </ProtectedRoute>
              } />

              {/* Old MLA Portal route - kept for legacy or redirect */}
              <Route path="/mla-portal" element={<Navigate to="/admin" />} />
            </Routes>
          </div>
          {/* <Footer role="public" /> */}
        </div>
        {/* <Chatbot /> */}
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
