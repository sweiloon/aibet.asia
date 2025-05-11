
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/components/ui/sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Handle email formatting
      let formattedEmail = email;
      if (!formattedEmail.includes("@")) {
        formattedEmail = `${formattedEmail}@aibet.asia`;
      }
      
      console.log(`Attempting login with: ${formattedEmail} as ${activeTab}`);
      
      const success = await login(formattedEmail, password, activeTab === "admin");
      
      if (success) {
        toast.success(`Logged in successfully as ${activeTab}`);
        navigate(activeTab === "admin" ? "/admin" : "/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <Tabs 
              defaultValue="user" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          placeholder="username"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pr-24"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                          @aibet.asia
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="password">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                    
                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="underline text-primary hover:text-primary/80"
                      >
                        Sign up
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="adminEmail">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Input
                          id="adminEmail"
                          placeholder="admin"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pr-24"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                          @aibet.asia
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="adminPassword">
                        Password
                      </label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Admin Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}
