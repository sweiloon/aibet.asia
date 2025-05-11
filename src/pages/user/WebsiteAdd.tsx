
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWebsites } from "@/context/WebsiteContext";

export default function WebsiteAdd() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [includeCredentials, setIncludeCredentials] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { addWebsite } = useWebsites();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format URL if needed
    let formattedUrl = url;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    
    // Create website object
    const websiteData = {
      name,
      url: formattedUrl,
      ...(includeCredentials ? { loginUrl, username, password } : {})
    };
    
    addWebsite(websiteData);
    setLoading(false);
    navigate("/dashboard/websites");
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Website</h1>
          <p className="text-muted-foreground">Submit a new website for management</p>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Website Details</CardTitle>
            <CardDescription>
              Fill in the details of the website you want us to manage
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Website Name</Label>
                  <Input
                    id="name"
                    placeholder="My Company Website"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    placeholder="www.example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="include-credentials"
                  checked={includeCredentials}
                  onCheckedChange={setIncludeCredentials}
                />
                <Label htmlFor="include-credentials">Include admin credentials for management</Label>
              </div>
              
              {includeCredentials && (
                <div className="pt-4 space-y-6 border-t border-border">
                  <div className="space-y-2">
                    <Label htmlFor="login-url">Admin Login URL</Label>
                    <Input
                      id="login-url"
                      placeholder="https://example.com/wp-admin"
                      value={loginUrl}
                      onChange={(e) => setLoginUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Admin Username</Label>
                      <Input
                        id="username"
                        placeholder="admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Admin Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your credentials are securely stored and only used for management purposes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/websites")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Website"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
