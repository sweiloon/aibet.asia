
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserSidebarItems } from "./UserSidebarItems";

export function UserSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center py-2">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
      </SidebarHeader>
      <SidebarContent>
        <UserSidebarItems />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
