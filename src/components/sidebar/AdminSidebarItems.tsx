
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Globe2,
  ClipboardCheck,
  Users,
  FileText,
  ListChecks,
} from "lucide-react";

interface AdminSidebarItemsProps {
  className?: string;
}

export function AdminSidebarItems({ className }: AdminSidebarItemsProps) {
  const navigate = useNavigate();
  
  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/admin")}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
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
          <button onClick={() => navigate("/admin/website-records")}>
            <ListChecks />
            <span>Website Records</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/admin/approvals")}>
            <ClipboardCheck />
            <span>Approvals</span>
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
    </SidebarMenu>
  );
}
