import { ReactNode } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardContent } from "./dashboard/DashboardContent";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export function DashboardLayout({
  children,
  isAdmin = false,
}: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar isAdmin={isAdmin} user={user} />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader isAdmin={isAdmin} />
          <DashboardContent>{children}</DashboardContent>
        </div>
      </div>
    </SidebarProvider>
  );
}
