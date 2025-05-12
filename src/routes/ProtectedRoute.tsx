
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Protected route component
export const ProtectedRoute = ({ 
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
