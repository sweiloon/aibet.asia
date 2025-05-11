
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Globe2, FileText, ShieldCheck, Users, LayoutDashboard } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export function DashboardLayout({ children, isAdmin = false }: DashboardLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-r-white/10">
          <SidebarHeader className="flex flex-col items-start py-4">
            <div className="px-4">
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => navigate("/")}
              >
                <span className="text-2xl font-bold text-gradient">WebManage</span>
                <span className="text-xs rounded-full px-2 bg-blue-500/30 text-blue-200">CRM</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isAdmin ? "Admin Dashboard" : "User Dashboard"}
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {isAdmin && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button onClick={() => navigate("/admin/websites")}>
                            <Globe2 />
                            <span>Websites</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button onClick={() => navigate("/admin/users")}>
                            <Users />
                            <span>Users</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button onClick={() => navigate("/admin/reports")}>
                            <FileText />
                            <span>Reports</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                  
                  {!isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button onClick={() => navigate("/dashboard/websites")}>
                          <Globe2 />
                          <span>My Websites</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={() => navigate(isAdmin ? "/admin/settings" : "/dashboard/settings")}>
                        <Settings />
                        <span>Settings</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button onClick={() => navigate("/admin/security")}>
                          <ShieldCheck />
                          <span>Security</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="w-full">
              <span className="text-xs text-muted-foreground block mb-2">
                Logged in as {user?.email}
              </span>
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="h-16 border-b border-border flex items-center px-6">
            <SidebarTrigger />
            <div className="ml-4 font-medium">
              {isAdmin ? "Administrator Dashboard" : "User Dashboard"}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
