
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatsCardsProps {
  websites: Website[];
  pendingCount: number;
  approvedCount: number;
}

export const StatsCards = ({ websites, pendingCount, approvedCount }: StatsCardsProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};
