
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Settings,
  ShieldCheck,
} from "lucide-react";

interface AccountItemsProps {
  isAdmin?: boolean;
  className?: string;
}

export function AccountItems({ isAdmin = false, className }: AccountItemsProps) {
  const navigate = useNavigate();
  
  return (
    <SidebarMenu className={className}>
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
  );
}
