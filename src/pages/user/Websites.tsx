
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsites } from "@/context/WebsiteContext";

export default function UserWebsites() {
  const { getUserWebsites } = useWebsites();
  const navigate = useNavigate();
  
  const userWebsites = getUserWebsites();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">Pending</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Websites</h1>
            <p className="text-muted-foreground">Manage your websites and view their status</p>
          </div>
          
          <Button onClick={() => navigate("/dashboard/websites/add")}>
            Add New Website
          </Button>
        </div>
        
        {userWebsites.length > 0 ? (
          <Card className="glass-morphism">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Management Records</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userWebsites.map((website) => (
                    <TableRow key={website.id}>
                      <TableCell className="font-medium">{website.name}</TableCell>
                      <TableCell>
                        <a 
                          href={website.url.startsWith("http") ? website.url : `https://${website.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {website.url}
                        </a>
                      </TableCell>
                      <TableCell>{getStatusBadge(website.status)}</TableCell>
                      <TableCell>{website.managementData.length}</TableCell>
                      <TableCell>{new Date(website.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/websites/${website.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-morphism">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <p className="text-xl">No websites submitted yet</p>
                <p className="text-muted-foreground mt-2">
                  Submit your first website for management.
                </p>
                <Button 
                  onClick={() => navigate("/dashboard/websites/add")}
                  className="mt-4"
                >
                  Add Your First Website
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
