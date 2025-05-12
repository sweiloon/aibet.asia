
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CredentialsTabContentProps {
  website: Website;
}

export function CredentialsTabContent({ website }: CredentialsTabContentProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Website Credentials</CardTitle>
        <CardDescription>
          Access credentials for website management
        </CardDescription>
      </CardHeader>
      <CardContent>
        {website.loginUrl ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Admin Login URL</Label>
              <div className="flex">
                <Input
                  readOnly
                  value={website.loginUrl}
                  className="rounded-r-none"
                />
                <Button
                  className="rounded-l-none"
                  onClick={() => window.open(website.loginUrl, "_blank")}
                >
                  Visit
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input readOnly value={website.username} />
              </div>
              
              <div className="space-y-2">
                <Label>Password</Label>
                <Input readOnly type="password" value={website.password} />
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 text-sm text-yellow-300">
              <strong>Note:</strong> These credentials are used for website management only.
              They are stored securely and only accessible by authorized admins.
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p>No credentials provided for this website.</p>
            <p className="text-muted-foreground text-sm mt-2">
              The user did not include admin credentials when submitting this website.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
