import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";

export function Navbar() {
  const { user, logout, checkAdminExists } = useAuth();
  const navigate = useNavigate();
  const [adminExists, setAdminExists] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const exists = await checkAdminExists();
      setAdminExists(exists);
    };

    checkAdmin();
  }, [checkAdminExists]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 w-full z-50 py-3 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gradient">WebManage</span>
          <span className="text-xs rounded-full px-2 bg-blue-500/30 text-blue-200">
            CRM
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>Get Started</Button>
              {!adminExists && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin-signup")}
                >
                  Admin Setup
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() =>
                  navigate(user.role === "admin" ? "/admin" : "/dashboard")
                }
              >
                Dashboard
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary/10">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(user.role === "admin" ? "/admin" : "/dashboard")
                    }
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(
                        user.role === "admin"
                          ? "/admin/settings"
                          : "/dashboard/settings"
                      )
                    }
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
