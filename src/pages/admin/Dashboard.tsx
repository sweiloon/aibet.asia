import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const { getAllWebsites } = useWebsites();
  const navigate = useNavigate();
  
  const websites = getAllWebsites();
  
  const pendingCount = websites.filter(site => site.status === "pending").length;
  const approvedCount = websites.filter(site => site.status === "approved").length;
  const rejectedCount = websites.filter(site => site.status === "rejected").length;
  
  const latestPendingWebsites = websites
    .filter(site => site.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  const websitesWithRecords = websites
    .filter(site => site.status === "approved" && site.managementData.length > 0)
    .sort((a, b) => {
      const latestA = [...a.managementData].sort((x, y) => {
        const dateA = x.date || x.startDate;
        const dateB = y.date || y.startDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];
      const latestB = [...b.managementData].sort((x, y) => {
        const dateA = x.date || x.startDate;
        const dateB = y.date || y.startDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];
      const dateA = latestA.date || latestA.startDate;
      const dateB = latestB.date || latestB.startDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all websites and user accounts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{websites.length}</CardTitle>
              <CardDescription>Total Websites</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                Total websites submitted to the platform
              </div>
              <Button 
                variant="link" 
                className="p-0 text-sm mt-2"
                onClick={() => navigate("/admin/websites")}
              >
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-3xl font-bold">{pendingCount}</CardTitle>
                <CardDescription>Pending Websites</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-yellow-300" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                Websites waiting for your approval
              </div>
              <Button 
                variant="link" 
                className="p-0 text-sm mt-2"
                onClick={() => navigate("/admin/websites?status=pending")}
              >
                Review Pending
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-3xl font-bold">{approvedCount}</CardTitle>
                <CardDescription>Active Websites</CardDescription>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-300" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                Websites currently under management
              </div>
              <Button 
                variant="link" 
                className="p-0 text-sm mt-2"
                onClick={() => navigate("/admin/websites?status=approved")}
              >
                View Active
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-300" />
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Websites that need your review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestPendingWebsites.length > 0 ? (
                <div className="space-y-4">
                  {latestPendingWebsites.map(website => (
                    <div key={website.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <div>
                        <div className="font-medium">{website.name}</div>
                        <div className="text-sm text-muted-foreground">{website.url}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Added {new Date(website.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/admin/websites/${website.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                  
                  {pendingCount > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate("/admin/websites?status=pending")}
                    >
                      View All ({pendingCount}) Pending Websites
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>No pending websites</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    All websites have been reviewed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-300" />
                Recent Management Records
              </CardTitle>
              <CardDescription>
                Latest website management activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {websitesWithRecords.length > 0 ? (
                <div className="space-y-4">
                  {websitesWithRecords.map(website => {
                    const latestRecord = [...website.managementData].sort(
                      (a, b) => {
                        const dateA = a.date || a.startDate;
                        const dateB = b.date || b.startDate;
                        return new Date(dateB).getTime() - new Date(dateA).getTime();
                      }
                    )[0];
                    
                    let completedTasks = 0;
                    let totalTasks = 0;
                    
                    if (latestRecord.tasks && latestRecord.tasks.length > 0) {
                      totalTasks = latestRecord.tasks.length;
                      completedTasks = latestRecord.tasks.filter(
                        task => task.status === "completed"
                      ).length;
                    }
                    
                    return (
                      <div key={website.id} className="p-3 border border-border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{website.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Updated {new Date(latestRecord.date || latestRecord.startDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/websites/${website.id}`)}
                          >
                            Details
                          </Button>
                        </div>
                        {latestRecord.tasks && latestRecord.tasks.length > 0 && (
                          <div className="mt-2 text-xs">
                            <span className="text-green-300">{completedTasks}</span>
                            <span className="text-muted-foreground">/{totalTasks} tasks completed</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate("/admin/websites?status=approved")}
                  >
                    View All Active Websites
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>No management records yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add management records to approved websites
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
