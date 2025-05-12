
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function UserDashboard() {
  const { getUserWebsites } = useWebsites();
  const navigate = useNavigate();
  
  // Get user's websites
  const userWebsites = getUserWebsites();
  
  // Count websites by status
  const pendingCount = userWebsites.filter(site => site.status === "pending").length;
  const approvedCount = userWebsites.filter(site => site.status === "approved").length;
  const rejectedCount = userWebsites.filter(site => site.status === "rejected").length;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor your websites</p>
          </div>
          
          <Button 
            onClick={() => navigate("/dashboard/websites/add")}
            className="mt-4 md:mt-0"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Website
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{userWebsites.length}</CardTitle>
              <CardDescription>Total Websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                All websites submitted to our platform
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{approvedCount}</CardTitle>
              <CardDescription>Active Websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Websites currently under active management
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{pendingCount}</CardTitle>
              <CardDescription>Pending Approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Websites waiting for admin approval
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Management Records</h2>
          
          {userWebsites.filter(site => site.status === "approved").length > 0 ? (
            <div className="space-y-4">
              {userWebsites
                .filter(site => site.status === "approved" && site.managementData.length > 0)
                .map(site => (
                  <Card key={site.id} className="glass-morphism overflow-hidden">
                    <CardHeader>
                      <CardTitle>{site.name}</CardTitle>
                      <CardDescription>{site.url}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {site.managementData
                          .sort((a, b) => {
                            const dateA = a.date || a.startDate;
                            const dateB = b.date || b.startDate;
                            return new Date(dateB).getTime() - new Date(dateA).getTime();
                          })
                          .slice(0, 3)
                          .map(record => {
                            if (record.tasks && record.tasks.length > 0) {
                              return (
                                <div key={record.id} className="border border-border p-4 rounded-md">
                                  <div className="flex justify-between items-center mb-2">
                                    <strong>Date: {new Date(record.date || record.startDate).toLocaleDateString()}</strong>
                                  </div>
                                  <div className="space-y-2">
                                    {record.tasks.map((task, index) => (
                                      <div 
                                        key={index}
                                        className="flex items-center justify-between text-sm"
                                      >
                                        <div>
                                          <span className="font-semibold">{task.type}:</span> {task.description}
                                        </div>
                                        <div>
                                          <span 
                                            className={`px-2 py-1 rounded-full text-xs ${
                                              task.status === "completed"
                                                ? "bg-green-500/20 text-green-300"
                                                : task.status === "in-progress"
                                                ? "bg-yellow-500/20 text-yellow-300"
                                                : "bg-blue-500/20 text-blue-300"
                                            }`}
                                          >
                                            {task.status}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            } else {
                              // For the new management record format
                              return (
                                <div key={record.id} className="border border-border p-4 rounded-md">
                                  <div className="flex justify-between items-center mb-2">
                                    <strong>Day: {record.day}</strong>
                                    <span>{record.startDate} - {record.endDate}</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Credit: {record.credit}</span>
                                      <span>Profit: {record.profit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Gross Profit: {record.grossProfit}</span>
                                      <span>Net Profit: {record.netProfit}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/dashboard/websites/${site.id}`)}
                        >
                          View All Records
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {userWebsites.filter(site => 
                site.status === "approved" && site.managementData.length > 0
              ).length === 0 && (
                <Card className="glass-morphism">
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <p>No management records available yet.</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Management records will appear once our team starts working on your websites.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="glass-morphism">
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-xl">No approved websites yet</p>
                  <p className="text-muted-foreground mt-2">
                    Submit your websites for approval to see management records here.
                  </p>
                  <Button 
                    onClick={() => navigate("/dashboard/websites/add")}
                    className="mt-4"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
