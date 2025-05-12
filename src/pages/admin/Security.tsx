
import { DashboardLayout } from "@/components/DashboardLayout";

export default function AdminSecurity() {
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">This page has been removed</p>
        </div>
        
        <div className="text-center py-10">
          <p>This section has been deprecated.</p>
          <p className="text-muted-foreground mt-2">Please use other admin tools for security management.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
