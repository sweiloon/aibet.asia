
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PendingApprovalsCardProps {
  pendingWebsites: Website[];
  pendingCount: number;
}

export const PendingApprovalsCard = ({ pendingWebsites, pendingCount }: PendingApprovalsCardProps) => {
  const navigate = useNavigate();
  
  return (
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
        {pendingWebsites.length > 0 ? (
          <div className="space-y-4">
            {pendingWebsites.map(website => (
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
  );
};
