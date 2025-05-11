
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, Globe2, KeyRound } from "lucide-react";
import { useWebsites } from "@/context/WebsiteContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminApprovals() {
  const { getAllWebsites, updateWebsiteStatus } = useWebsites();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get all websites from context
  const allWebsites = getAllWebsites();
  
  // Filter for pending websites
  const pendingWebsites = allWebsites.filter(website => 
    website.status === "pending" &&
    (searchTerm === "" || 
     website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     website.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleApprove = (websiteId: string) => {
    updateWebsiteStatus(websiteId, "approved");
    toast({
      title: "Website approved",
      description: "The website has been approved for management.",
    });
  };
  
  const handleReject = (websiteId: string) => {
    updateWebsiteStatus(websiteId, "rejected");
    toast({
      title: "Website rejected",
      description: "The website has been rejected.",
    });
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Approval Requests</h1>
          <p className="text-muted-foreground">Review and approve website submissions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Card className="glass-morphism">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Credentials</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingWebsites.length > 0 ? (
                  pendingWebsites.map((website) => (
                    <TableRow key={website.id}>
                      <TableCell className="font-medium">{website.name}</TableCell>
                      <TableCell>
                        <a 
                          href={website.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline"
                        >
                          <Globe2 className="h-4 w-4" />
                          {website.url}
                        </a>
                      </TableCell>
                      <TableCell>{website.userId}</TableCell>
                      <TableCell>{new Date(website.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {website.loginUrl && website.username ? (
                          <Badge className="flex items-center gap-1">
                            <KeyRound className="h-3 w-3" />
                            Provided
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300"
                            title="Approve"
                            onClick={() => handleApprove(website.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                            title="Reject"
                            onClick={() => handleReject(website.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <p>No pending approval requests</p>
                      {searchTerm && (
                        <Button
                          variant="link"
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
