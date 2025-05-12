
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, checkAdminExists } = useAuth();
  const navigate = useNavigate();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
    
    // Check if admin exists
    const checkAdmin = async () => {
      const exists = await checkAdminExists();
      setAdminExists(exists);
    };
    
    checkAdmin();
  }, [user, navigate, checkAdminExists]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AIBET Management</h1>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container mx-auto py-16 px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to AIBET Management System</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage and track all your websites, analytics, and user data in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
            
            {/* Only show Admin Setup button if no admin exists */}
            {adminExists === false && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/admin-signup">Admin Setup</Link>
              </Button>
            )}
          </div>
        </section>
        
        <section className="bg-muted py-16">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold mb-8 text-center">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-2">Website Management</h4>
                <p className="text-muted-foreground">
                  Add, track, and manage all your websites from a centralized dashboard.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-2">User Administration</h4>
                <p className="text-muted-foreground">
                  Manage users, assign roles, and control access levels across the platform.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-2">Performance Analytics</h4>
                <p className="text-muted-foreground">
                  Get detailed insights and analytics about your website performance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 AIBET Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
