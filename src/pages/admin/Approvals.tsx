
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Globe2, 
  KeyRound, 
  Eye, 
  History 
} from "lucide-react";
import { useWebsites } from "@/context/WebsiteContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminApprovals() {
  const { getAllWebsites, updateWebsiteStatus } = useWebsites();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  
  // Get all websites from context
  const allWebsites = getAllWebsites();
  
  // Filter for pending websites
  const pendingWebsites = allWebsites.filter(website => 
    website.status === "pending" &&
    (searchTerm === "" || 
     website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     website.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter for approved websites
  const approvedWebsites = allWebsites.filter(website => 
    website.status === "approved" &&
    (searchTerm === "" || 
     website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     website.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter for rejected websites
  const rejectedWebsites = allWebsites.filter(website => 
    website.status === "rejected" &&
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
  
  const viewWebsiteDetails = (website: any) => {
    setSelectedWebsite(website);
    setDetailsOpen(true);
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Approval Requests</h1>
          <p className="text-muted-foreground">Review and manage website submissions</p>
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
        
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <span className="hidden sm:inline">Pending Approvals</span>
              <Badge variant="outline">{pendingWebsites.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <span className="hidden sm:inline">Approved</span>
              <Badge variant="outline">{approvedWebsites.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <span className="hidden sm:inline">Rejected</span>
              <Badge variant="outline">{rejectedWebsites.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
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
                            {website.username ? (
                              <Badge className="flex items-center gap-1">
                                <KeyRound className="h-3 w-3" />
                                Provided
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewWebsiteDetails(website)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
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
          </TabsContent>
          
          <TabsContent value="approved">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Website Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Date Approved</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedWebsites.length > 0 ? (
                      approvedWebsites.map((website) => (
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
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewWebsiteDetails(website)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p>No approved websites found</p>
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
          </TabsContent>
          
          <TabsContent value="rejected">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Website Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Date Rejected</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedWebsites.length > 0 ? (
                      rejectedWebsites.map((website) => (
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
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewWebsiteDetails(website)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p>No rejected websites found</p>
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
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Website Details</DialogTitle>
            <DialogDescription>
              Full details for the website submission
            </DialogDescription>
          </DialogHeader>
          {selectedWebsite && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website Name</p>
                  <p className="text-base">{selectedWebsite.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">URL</p>
                  <a 
                    href={selectedWebsite.url} 
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {selectedWebsite.url}
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted By</p>
                  <p className="text-base">{selectedWebsite.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                  <p className="text-base">{new Date(selectedWebsite.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">Login Credentials</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p className="text-base">{selectedWebsite.username || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Password</p>
                    <p className="text-base">{selectedWebsite.password || "Not provided"}</p>
                  </div>
                </div>
              </div>
              
              {selectedWebsite.status === "pending" && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300"
                    onClick={() => {
                      handleApprove(selectedWebsite.id);
                      setDetailsOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                    onClick={() => {
                      handleReject(selectedWebsite.id);
                      setDetailsOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
