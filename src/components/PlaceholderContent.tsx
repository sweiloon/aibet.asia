
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowLeft } from "lucide-react";

interface PlaceholderContentProps {
  title?: string;
  description?: string;
}

export function PlaceholderContent({ 
  title = "Page Under Construction", 
  description = "This feature is currently being developed and will be available soon." 
}: PlaceholderContentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center justify-center p-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-blue-100 p-8">
              <Wrench className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              We're working hard to bring you this feature. Please check back later for updates.
            </p>
            <p className="text-sm text-muted-foreground">
              Current path: {location.pathname}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
