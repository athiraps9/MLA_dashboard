import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PublicDashboard from './pages/PublicDashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MLADashboard from './pages/MLADashboard';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import MLADirectory from './pages/MLADirectory';
import MLADetail from './pages/MLADetail';
import Profile from './pages/Profile';
import ComplaintPortal from './pages/ComplaintPortal';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

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
    if (role && user.role !== role && role !== 'public') {
      return <Navigate to="/" />;
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />

              <Route path="/dashboard" element={
                <ProtectedRoute role="public">
                  <PublicDashboard />
                </ProtectedRoute>
              } />

              <Route path="/complaints" element={
                <ProtectedRoute role="public">
                  <ComplaintPortal />
                </ProtectedRoute>
              } />

              <Route path="/mla-directory" element={<MLADirectory />} />
              <Route path="/mla-directory/:id" element={<MLADetail />} />

              <Route path="/profile" element={
                <ProtectedRoute role="public">
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/mla-portal" element={
                <ProtectedRoute role="mla">
                  <MLADashboard user={user} />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
        <Chatbot />
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
