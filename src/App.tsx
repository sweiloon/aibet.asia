
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './context/AuthContext';
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebsiteProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/websites" element={<AdminWebsites />} />
            <Route path="/admin/websites/:id" element={<AdminWebsiteDetail />} />
            <Route path="/admin/users" element={<AdminUsers />} /> {/* New route */}
            <Route path="/admin/reports" element={<AdminReports />} /> {/* New route */}
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/security" element={<AdminSecurity />} /> {/* New route */}
            
            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/websites" element={<UserWebsites />} />
            <Route path="/dashboard/websites/add" element={<UserWebsiteAdd />} />
            <Route path="/dashboard/websites/:id" element={<UserWebsiteDetail />} />
            <Route path="/dashboard/settings" element={<UserSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WebsiteProvider>
    </AuthProvider>
  );
};

export default App;
