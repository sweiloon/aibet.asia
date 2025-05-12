
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Admin Dashboard Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";
import AdminWebsites from "@/pages/admin/Websites";
import AdminWebsiteDetail from "@/pages/admin/WebsiteDetail";
import AdminUsers from "@/pages/admin/Users";
import AdminReports from "@/pages/admin/Reports";
import AdminApprovals from "@/pages/admin/Approvals";
import AdminWebsiteRecords from "@/pages/admin/WebsiteRecords";

export const adminRoutes = [
  <Route 
    key="admin-dashboard"
    path="/admin" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-settings"
    path="/admin/settings" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminSettings />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-websites"
    path="/admin/websites" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminWebsites />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-website-detail"
    path="/admin/websites/:id" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminWebsiteDetail />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-website-records"
    path="/admin/website-records" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminWebsiteRecords />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-users"
    path="/admin/users" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminUsers />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-reports"
    path="/admin/reports" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminReports />
      </ProtectedRoute>
    }
  />,
  <Route 
    key="admin-approvals"
    path="/admin/approvals" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminApprovals />
      </ProtectedRoute>
    }
  />
];
