
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, UserCheck } from "lucide-react";

export default function AdminSecurity() {
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage system security settings and access controls</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" />
                Login Security
              </CardTitle>
              <CardDescription>Configure login protection settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Two-factor authentication</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Brute force protection</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>IP whitelist</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Partial</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-400" />
                Access Logs
              </CardTitle>
              <CardDescription>Recent system access attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span>admin@example.com</span>
                  <span className="text-green-600">Successful</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>user1@example.com</span>
                  <span className="text-green-600">Successful</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>unknown@test.com</span>
                  <span className="text-red-600">Failed</span>
                </div>
                <div className="flex justify-between">
                  <span>user2@example.com</span>
                  <span className="text-green-600">Successful</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
