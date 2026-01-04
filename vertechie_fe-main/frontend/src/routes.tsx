import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Networking from './pages/Networking';
import Companies from './pages/Companies';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './components/pages/Terms';
import Privacy from './components/pages/Privacy';
import Cookies from './components/pages/Cookies';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import BlacklistPolicy from './pages/BlacklistPolicy';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/networking" element={<Networking />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/blacklist-policy" element={<BlacklistPolicy />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 