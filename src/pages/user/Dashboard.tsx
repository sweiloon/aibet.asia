
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites } from "@/context/WebsiteContext";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatisticsCards } from "@/components/dashboard/user/StatisticsCards";
import { ManagementRecords } from "@/components/dashboard/user/ManagementRecords";

export default function UserDashboard() {
  const { getUserWebsites } = useWebsites();
  
  // Get user's websites
  const userWebsites = getUserWebsites();
  
  // Count websites by status
  const pendingCount = userWebsites.filter(site => site.status === "pending").length;
  const approvedCount = userWebsites.filter(site => site.status === "approved").length;
  const rejectedCount = userWebsites.filter(site => site.status === "rejected").length;
  
  // Filter approved websites for management records
  const approvedWebsites = userWebsites.filter(site => site.status === "approved");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeHeader />
        <StatisticsCards 
          websites={userWebsites}
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
        />
        <ManagementRecords approvedWebsites={approvedWebsites} />
      </div>
    </DashboardLayout>
  );
}
