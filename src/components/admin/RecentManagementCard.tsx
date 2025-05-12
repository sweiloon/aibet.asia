
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentManagementCardProps {
  websitesWithRecords: Website[];
}

export const RecentManagementCard = ({ websitesWithRecords }: RecentManagementCardProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};
