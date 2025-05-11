
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaceholderContent } from "@/components/PlaceholderContent";

export default function AdminReports() {
  return (
    <DashboardLayout isAdmin>
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and export system reports</p>
      </div>
      
      <PlaceholderContent 
        title="Reporting System"
        description="This section will provide comprehensive reports and analytics."
      />
    </DashboardLayout>
  );
}
