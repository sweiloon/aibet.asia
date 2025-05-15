import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Protected route component that handles loading state and auth checks
export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
  redirectTo?: string;
}) => {
  const { user, loading } = useAuth();

  // While checking authentication, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-sm text-muted-foreground">
          Loading your profile...
        </p>
      </div>
    );
  }

  // If not authenticated or doesn't have the required role
  if (!user || (requiredRole && user.role !== requiredRole)) {
    // Log that we're redirecting
    console.log(
      "Not authenticated or missing required role, redirecting to:",
      redirectTo
    );
    // Navigate to login
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated with correct role
  return <>{children}</>;
};
