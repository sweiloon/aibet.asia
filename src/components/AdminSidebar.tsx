
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AdminSidebarItems } from "./AdminSidebarItems";

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center py-2">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </SidebarHeader>
      <SidebarContent>
        <AdminSidebarItems />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
