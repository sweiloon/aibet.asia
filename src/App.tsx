
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
import NotFound from "./pages/NotFound";

// User Dashboard Pages
import UserDashboard from "./pages/user/Dashboard";
import UserSettings from "./pages/user/Settings";
import UserWebsites from "./pages/user/Websites";
import WebsiteAdd from "./pages/user/WebsiteAdd";
import WebsiteDetail from "./pages/user/WebsiteDetail";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import AdminWebsites from "./pages/admin/Websites";
import AdminWebsiteDetail from "./pages/admin/WebsiteDetail";

const queryClient = new QueryClient();

// Protected route component for regular users
const UserRoute = ({ 
  children,
  redirectTo = "/login" 
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  const { user, loading } = useAuth();
  
  // While checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated or not a user
  if (!user || user.role !== "user") {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

// Protected route component for admin users
const AdminRoute = ({ 
  children,
  redirectTo = "/login" 
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  const { user, loading } = useAuth();
  
  // While checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated or not an admin
  if (!user || user.role !== "admin") {
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
              
              {/* User Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <UserRoute>
                    <UserDashboard />
                  </UserRoute>
                }
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <UserRoute>
                    <UserSettings />
                  </UserRoute>
                }
              />
              <Route 
                path="/dashboard/websites" 
                element={
                  <UserRoute>
                    <UserWebsites />
                  </UserRoute>
                }
              />
              <Route 
                path="/dashboard/websites/add" 
                element={
                  <UserRoute>
                    <WebsiteAdd />
                  </UserRoute>
                }
              />
              <Route 
                path="/dashboard/websites/:id" 
                element={
                  <UserRoute>
                    <WebsiteDetail />
                  </UserRoute>
                }
              />
              
              {/* Admin Dashboard Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
              <Route 
                path="/admin/websites" 
                element={
                  <AdminRoute>
                    <AdminWebsites />
                  </AdminRoute>
                }
              />
              <Route 
                path="/admin/websites/:id" 
                element={
                  <AdminRoute>
                    <AdminWebsiteDetail />
                  </AdminRoute>
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
