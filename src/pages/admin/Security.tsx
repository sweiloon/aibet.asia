
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Lock, KeyRound, UserCheck } from "lucide-react";

export default function AdminSecurity() {
  const [securityLevel, setSecurityLevel] = useState("medium");

  const handleSecurityLevelChange = (level: string) => {
    setSecurityLevel(level);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage system security settings and access controls</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Security Level
              </CardTitle>
              <CardDescription>Current system security level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Level:</span>
                  <span className="font-medium">{securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}</span>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant={securityLevel === "low" ? "default" : "outline"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleSecurityLevelChange("low")}
                  >
                    Low
                  </Button>
                  <Button 
                    variant={securityLevel === "medium" ? "default" : "outline"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleSecurityLevelChange("medium")}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={securityLevel === "high" ? "default" : "outline"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleSecurityLevelChange("high")}
                  >
                    High
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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

        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Security Alerts
            </CardTitle>
            <CardDescription>System generated security alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="font-medium text-amber-800">Minor: Network access attempt</div>
                <div className="text-sm text-amber-700 mt-1">Unusual login attempt from IP: 192.168.1.55</div>
                <div className="text-xs text-amber-600 mt-1">May 12, 2025 - 08:23 AM</div>
              </div>
              
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="font-medium text-red-800">Critical: Multiple failed login attempts</div>
                <div className="text-sm text-red-700 mt-1">5 failed login attempts for user: admin@example.com</div>
                <div className="text-xs text-red-600 mt-1">May 11, 2025 - 11:45 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
