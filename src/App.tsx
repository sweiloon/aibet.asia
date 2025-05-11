
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WebsiteProvider } from "./context/WebsiteContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminSignUp from "./pages/AdminSignUp";
import NotFound from "./pages/NotFound";

// User Dashboard Pages
import UserDashboard from "./pages/user/Dashboard";
import UserSettings from "./pages/user/Settings";
import UserWebsites from "./pages/user/Websites";
import WebsiteAdd from "./pages/user/WebsiteAdd";
import WebsiteDetail from "./pages/user/WebsiteDetail";
import UploadHistory from "./pages/user/UploadHistory";
import UploadDocument from "./pages/user/UploadDocument";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import AdminWebsites from "./pages/admin/Websites";
import AdminWebsiteDetail from "./pages/admin/WebsiteDetail";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import AdminSecurity from "./pages/admin/Security";
import AdminApprovals from "./pages/admin/Approvals";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole,
  redirectTo = "/login" 
}: { 
  children: React.ReactNode; 
  requiredRole?: "user" | "admin";
  redirectTo?: string;
}) => {
  const { user, loading } = useAuth();
  
  // While checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated or doesn't have the required role
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WebsiteProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin-signup" element={<AdminSignUp />} />
              
              {/* User Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserSettings />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/websites" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserWebsites />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/websites/add" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <WebsiteAdd />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/websites/:id" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <WebsiteDetail />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/upload-history" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <UploadHistory />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard/upload-document" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <UploadDocument />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Dashboard Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/websites" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminWebsites />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/websites/:id" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminWebsiteDetail />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminReports />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/security" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSecurity />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/approvals" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminApprovals />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WebsiteProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
