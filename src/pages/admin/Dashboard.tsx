
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites } from "@/context/WebsiteContext";
import { StatsCards } from "@/components/admin/StatsCards";
import { PendingApprovalsCard } from "@/components/admin/PendingApprovalsCard";
import { RecentManagementCard } from "@/components/admin/RecentManagementCard";

export default function AdminDashboard() {
  const { getAllWebsites } = useWebsites();
  
  const websites = getAllWebsites();
  
  const pendingCount = websites.filter(site => site.status === "pending").length;
  const approvedCount = websites.filter(site => site.status === "approved").length;
  
  const latestPendingWebsites = websites
    .filter(site => site.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  const websitesWithRecords = websites
    .filter(site => site.status === "approved" && site.managementData.length > 0)
    .sort((a, b) => {
      const latestA = [...a.managementData].sort((x, y) => {
        const dateA = x.date || x.startDate;
        const dateB = y.date || y.startDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];
      const latestB = [...b.managementData].sort((x, y) => {
        const dateA = x.date || x.startDate;
        const dateB = y.date || y.startDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];
      const dateA = latestA.date || latestA.startDate;
      const dateB = latestB.date || latestB.startDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all websites and user accounts</p>
        </div>
        
        <StatsCards 
          websites={websites}
          pendingCount={pendingCount}
          approvedCount={approvedCount}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PendingApprovalsCard 
            pendingWebsites={latestPendingWebsites}
            pendingCount={pendingCount}
          />
          
          <RecentManagementCard 
            websitesWithRecords={websitesWithRecords}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
