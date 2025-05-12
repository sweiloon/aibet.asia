
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useWebsites } from "@/context/WebsiteContext";
import { toast } from "@/components/ui/sonner";

export default function WebsiteAdd() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { addWebsite } = useWebsites();
  const navigate = useNavigate();
  
  // Validate URL format
  const validateUrl = (url: string) => {
    // Basic URL validation
    let formattedUrl = url.trim();
    
    if (!formattedUrl) {
      setUrlError("URL is required");
      return null;
    }
    
    // Add protocol if missing
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    
    try {
      new URL(formattedUrl);
      setUrlError("");
      return formattedUrl;
    } catch (err) {
      setUrlError("Please enter a valid URL");
      return null;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Validate URL
    const formattedUrl = validateUrl(url);
    if (!formattedUrl) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create website object
      const websiteData = {
        name,
        url: formattedUrl,
        username,
        password
      };
      
      addWebsite(websiteData);
      navigate("/dashboard/websites");
    } catch (error) {
      console.error("Error adding website:", error);
      toast.error("Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Website</h1>
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
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) validateUrl(e.target.value);
                    }}
                    className={urlError ? "border-red-500" : ""}
                    required
                  />
                  {urlError && (
                    <p className="text-xs text-red-500">{urlError}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 space-y-6 border-t border-border">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Admin Username</Label>
                    <Input
                      id="username"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Admin Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className={passwordError ? "border-red-500" : ""}
                      required
                    />
                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Your credentials are securely stored and only used for management purposes.
                </p>
              </div>
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
