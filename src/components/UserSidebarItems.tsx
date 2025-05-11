
import { NavLink } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  Upload, 
  History,
  List
} from "lucide-react";

export function UserSidebarItems() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <LayoutDashboard className="mr-2" />
            <span>Dashboard</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="My Websites">
          <NavLink
            to="/dashboard/websites"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <Globe className="mr-2" />
            <span>My Websites</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Website Records">
          <NavLink
            to="/dashboard/website-records"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <List className="mr-2" />
            <span>Website Records</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Upload Document">
          <NavLink
            to="/dashboard/upload-document"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <Upload className="mr-2" />
            <span>Upload Document</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Upload History">
          <NavLink
            to="/dashboard/upload-history"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <History className="mr-2" />
            <span>Upload History</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Settings">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <Settings className="mr-2" />
            <span>Settings</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
