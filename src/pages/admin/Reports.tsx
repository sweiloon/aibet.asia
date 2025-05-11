
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports Dashboard</h1>
          <p className="text-muted-foreground">View and manage system reports</p>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Reports Overview</CardTitle>
            <CardDescription>Analytics and statistics for your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center">
              <p className="text-xl">Report functionality coming soon</p>
              <p className="text-muted-foreground mt-2">This feature is currently under development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
