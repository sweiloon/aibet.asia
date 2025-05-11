
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

export default function AdminSecurity() {
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage system security and access controls</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <ShieldCheck className="mr-2 h-5 w-5 text-green-400" />
                <CardTitle>System Security</CardTitle>
              </div>
              <CardDescription>Security status and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="mb-2">System security module coming soon</p>
                <p className="text-muted-foreground">Configure security settings and policies</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <Shield className="mr-2 h-5 w-5 text-blue-400" />
                <CardTitle>Access Control</CardTitle>
              </div>
              <CardDescription>Manage roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="mb-2">Access control module coming soon</p>
                <p className="text-muted-foreground">Define user roles and security levels</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <ShieldAlert className="mr-2 h-5 w-5 text-yellow-400" />
                <CardTitle>Security Logs</CardTitle>
              </div>
              <CardDescription>Review security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="mb-2">Security logs module coming soon</p>
                <p className="text-muted-foreground">Monitor and audit security events</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
