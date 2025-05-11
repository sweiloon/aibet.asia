
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine where to redirect based on authentication status
  const getRedirectPath = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/admin" : "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white dark:bg-slate-900">
        <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">Oops! Page not found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to={getRedirectPath()}>
            {!user ? "Return to Home" : `Return to ${user.role === "admin" ? "Admin" : "User"} Dashboard`}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
