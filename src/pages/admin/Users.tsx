
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlaceholderContent } from "@/components/PlaceholderContent";

export default function AdminUsers() {
  return (
    <DashboardLayout isAdmin>
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users and their permissions</p>
      </div>
      
      <PlaceholderContent 
        title="User Management"
        description="This section will allow you to manage all users in the system."
      />
    </DashboardLayout>
  );
}
