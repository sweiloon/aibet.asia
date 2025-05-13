import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { AdminSidebarItems } from "../sidebar/AdminSidebarItems";
import { UserSidebarItems } from "../sidebar/UserSidebarItems";
import { AccountItems } from "../sidebar/AccountItems";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/context/AuthContext"; // Assuming User type is exported

interface DashboardSidebarProps {
  isAdmin?: boolean;
  user: User;
}

export function DashboardSidebar({
  isAdmin = false,
  user,
}: DashboardSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getRankingBadge = () => {
    // Default to "customer" if no ranking is set
    const userRanking = user.ranking || "customer";

    const rankingStyles: { [key: string]: string } = {
      customer: "bg-blue-500/20 text-blue-300",
      agent: "bg-green-500/20 text-green-300",
      master: "bg-purple-500/20 text-purple-300",
      senior: "bg-yellow-500/20 text-yellow-300",
    };

    const style = rankingStyles[userRanking] || "";

    return (
      <Badge className={`${style} mb-2`}>
        {userRanking.charAt(0).toUpperCase() + userRanking.slice(1)}
      </Badge>
    );
  };

  return (
    <Sidebar className="border-r border-r-white/10">
      <SidebarHeader className="flex flex-col items-start py-4">
        <div className="px-4 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">WebManage</span>
            <span className="text-xs rounded-full px-2 bg-blue-500/30 text-blue-200">
              CRM
            </span>
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
            {isAdmin ? <AdminSidebarItems /> : <UserSidebarItems />}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <AccountItems isAdmin={isAdmin} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="w-full">
          {!isAdmin && getRankingBadge()}
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
  );
}
