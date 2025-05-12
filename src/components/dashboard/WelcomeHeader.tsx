
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WelcomeHeader() {
  const navigate = useNavigate();
  
  return (
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
  );
}
