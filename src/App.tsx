
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebsiteProvider } from './context/WebsiteContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/admin/Dashboard';
import AdminWebsites from './pages/admin/Websites';
import AdminWebsiteDetail from './pages/admin/WebsiteDetail';
import UserDashboard from './pages/user/Dashboard';
import UserWebsites from './pages/user/Websites';
import UserWebsiteAdd from './pages/user/WebsiteAdd';
import UserWebsiteDetail from './pages/user/WebsiteDetail';
import AdminSettings from './pages/admin/Settings';
import UserSettings from './pages/user/Settings';
import NotFound from './pages/NotFound';
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import AdminSecurity from "./pages/admin/Security";

// Route guard for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Route guard for user routes
const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  // Use effect to redirect based on role when user logs in
  useEffect(() => {
    if (user) {
      const currentPath = window.location.pathname;
      
      // If on login or signup pages, redirect to appropriate dashboard
      if (['/login', '/signup', '/'].includes(currentPath)) {
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    }
  }, [user]);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/websites" element={
        <AdminRoute>
          <AdminWebsites />
        </AdminRoute>
      } />
      <Route path="/admin/websites/:id" element={
        <AdminRoute>
          <AdminWebsiteDetail />
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      } />
      <Route path="/admin/reports" element={
        <AdminRoute>
          <AdminReports />
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      } />
      <Route path="/admin/security" element={
        <AdminRoute>
          <AdminSecurity />
        </AdminRoute>
      } />
      
      {/* User Routes */}
      <Route path="/dashboard" element={
        <UserRoute>
          <UserDashboard />
        </UserRoute>
      } />
      <Route path="/dashboard/websites" element={
        <UserRoute>
          <UserWebsites />
        </UserRoute>
      } />
      <Route path="/dashboard/websites/add" element={
        <UserRoute>
          <UserWebsiteAdd />
        </UserRoute>
      } />
      <Route path="/dashboard/websites/:id" element={
        <UserRoute>
          <UserWebsiteDetail />
        </UserRoute>
      } />
      <Route path="/dashboard/settings" element={
        <UserRoute>
          <UserSettings />
        </UserRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebsiteProvider>
        <BrowserRouter>
          <Toaster />
          <AppRoutes />
        </BrowserRouter>
      </WebsiteProvider>
    </AuthProvider>
  );
};

export default App;
