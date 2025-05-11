
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaceholderContent } from "@/components/PlaceholderContent";

export default function AdminSecurity() {
  return (
    <DashboardLayout isAdmin>
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage system security settings</p>
      </div>
      
      <PlaceholderContent 
        title="Security Configuration"
        description="This section will allow you to configure security settings for the platform."
      />
    </DashboardLayout>
  );
}
