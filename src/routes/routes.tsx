
import { Routes } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes}
      
      {/* User Dashboard Routes */}
      {userRoutes}
      
      {/* Admin Dashboard Routes */}
      {adminRoutes}
    </Routes>
  );
};

export { AppRoutes };
export { ProtectedRoute } from "./ProtectedRoute";
