
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

export default function AdminSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage security settings for your admin account</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className={twoFactorEnabled ? "bg-green-900/20" : "bg-yellow-900/20"}>
                <Shield className={twoFactorEnabled ? "text-green-400" : "text-yellow-400"} />
                <AlertTitle>
                  {twoFactorEnabled ? "Two-factor authentication is enabled" : "Protect your account"}
                </AlertTitle>
                <AlertDescription>
                  {twoFactorEnabled 
                    ? "Your account is protected with an additional layer of security." 
                    : "Enable two-factor authentication for increased security."}
                </AlertDescription>
              </Alert>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                variant={twoFactorEnabled ? "outline" : "default"}
              >
                {twoFactorEnabled ? "Disable" : "Enable"} Two-Factor Authentication
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>Monitor recent login activity for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Started {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        IP: 192.168.1.1 • Browser: Chrome
                      </p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Previous Login</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - 86400000).toLocaleDateString()} {new Date(Date.now() - 86400000).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        IP: 192.168.1.1 • Browser: Chrome
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View All Activity</Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Security Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications about important security events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="securityEmail">
                  Security Email
                </label>
                <Input id="securityEmail" type="email" defaultValue="admin@aibet.asia" />
                <p className="text-xs text-muted-foreground">
                  Email where security notifications will be sent
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="backupEmail">
                  Backup Email (Optional)
                </label>
                <Input id="backupEmail" type="email" placeholder="Enter a backup email" />
                <p className="text-xs text-muted-foreground">
                  Additional email for important notifications
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
