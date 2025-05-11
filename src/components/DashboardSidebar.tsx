
import { AdminSidebar } from "./AdminSidebar";
import { UserSidebar } from "./UserSidebar";

interface DashboardSidebarProps {
  isAdmin?: boolean;
}

export function DashboardSidebar({ isAdmin = false }: DashboardSidebarProps) {
  return isAdmin ? <AdminSidebar /> : <UserSidebar />;
}
