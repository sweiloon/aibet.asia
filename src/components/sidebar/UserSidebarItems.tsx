
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Upload,
  History,
  Files,
  ListChecks,
} from "lucide-react";

interface UserSidebarItemsProps {
  className?: string;
}

export function UserSidebarItems({ className }: UserSidebarItemsProps) {
  const navigate = useNavigate();
  
  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard")}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/websites/add")}>
            <Upload />
            <span>Upload Website</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/upload-history")}>
            <History />
            <span>Upload History</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/website-records")}>
            <ListChecks />
            <span>Website Records</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/upload-document")}>
            <Files />
            <span>Upload Document</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
