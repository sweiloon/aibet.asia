
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  isAdmin?: boolean;
}

export function DashboardHeader({ isAdmin = false }: DashboardHeaderProps) {
  return (
    <div className="h-16 border-b border-border flex items-center px-6">
      <SidebarTrigger />
      <div className="ml-4 font-medium">
        {isAdmin ? "Administrator Dashboard" : "User Dashboard"}
      </div>
    </div>
  );
}
