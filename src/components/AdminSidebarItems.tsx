
import { NavLink } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Globe, 
  Users, 
  FileBarChart, 
  Settings, 
  Shield, 
  ClipboardCheck, 
  List 
} from "lucide-react";

export function AdminSidebarItems() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Dashboard">
          <NavLink
            to="/admin"
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
        <SidebarMenuButton asChild tooltip="Websites">
          <NavLink
            to="/admin/websites"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <Globe className="mr-2" />
            <span>Websites</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Website Records">
          <NavLink
            to="/admin/website-records"
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
        <SidebarMenuButton asChild tooltip="Users">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <Users className="mr-2" />
            <span>Users</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Reports">
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <FileBarChart className="mr-2" />
            <span>Reports</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Approvals">
          <NavLink
            to="/admin/approvals"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <ClipboardCheck className="mr-2" />
            <span>Approvals</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Security">
          <NavLink
            to="/admin/security"
            className={({ isActive }) =>
              isActive ? "data-[active=true]" : ""
            }
          >
            <Shield className="mr-2" />
            <span>Security</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Settings">
          <NavLink
            to="/admin/settings"
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
