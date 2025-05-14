import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// User Dashboard Pages
import UserDashboard from "@/pages/user/Dashboard";
import UserSettings from "@/pages/user/Settings";
import UserWebsites from "@/pages/user/Websites";
import WebsiteAdd from "@/pages/user/WebsiteAdd";
import WebsiteDetail from "@/pages/user/WebsiteDetail";
import UploadHistory from "@/pages/user/UploadHistory";
import UploadDocument from "@/pages/user/UploadDocument";
import UserWebsiteRecords from "@/pages/user/WebsiteRecords";

export const userRoutes = [
  <Route
    key="user-dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute requiredRole="user">
        <UserDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-settings"
    path="/dashboard/settings"
    element={
      <ProtectedRoute requiredRole="user">
        <UserSettings />
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-websites"
    path="/dashboard/websites"
    element={
      <ProtectedRoute requiredRole="user">
        <UserWebsites />
      </ProtectedRoute>
    }
  />,
  <Route
    key="website-add"
    path="/dashboard/websites/add"
    element={
      <ProtectedRoute requiredRole="user">
        <WebsiteAdd />
      </ProtectedRoute>
    }
  />,
  <Route
    key="website-detail"
    path="/dashboard/websites/:id"
    element={
      <ProtectedRoute requiredRole="user">
        <WebsiteDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="upload-history"
    path="/dashboard/upload-history"
    element={
      <ProtectedRoute requiredRole="user">
        <UploadHistory />
      </ProtectedRoute>
    }
  />,
  <Route
    key="upload-document"
    path="/dashboard/upload-document"
    element={
      <ProtectedRoute requiredRole="user">
        <UploadDocument />
      </ProtectedRoute>
    }
  />,
  <Route
    key="website-records"
    path="/dashboard/website-records"
    element={
      <ProtectedRoute requiredRole="user">
        <UserWebsiteRecords />
      </ProtectedRoute>
    }
  />,
];
