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
  History,
  FileText,
  File
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
  
  // Filter for pending websites and documents
  const pendingItems = allWebsites.filter(item => 
    item.status === "pending" &&
    (searchTerm === "" || 
     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  // Filter for approved websites and documents
  const approvedItems = allWebsites.filter(item => 
    item.status === "approved" &&
    (searchTerm === "" || 
     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  // Filter for rejected websites and documents
  const rejectedItems = allWebsites.filter(item => 
    item.status === "rejected" &&
    (searchTerm === "" || 
     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const handleApprove = (itemId: string) => {
    updateWebsiteStatus(itemId, "approved");
    toast({
      title: "Item approved",
      description: "The item has been approved.",
    });
  };
  
  const handleReject = (itemId: string) => {
    updateWebsiteStatus(itemId, "rejected");
    toast({
      title: "Item rejected",
      description: "The item has been rejected.",
    });
  };
  
  const viewItemDetails = (item: any) => {
    setSelectedWebsite(item);
    setDetailsOpen(true);
  };
  
  const getItemIcon = (type: string) => {
    switch(type) {
      case 'website':
        return <Globe2 className="h-4 w-4" />;
      case 'id-card':
        return <File className="h-4 w-4" />;
      case 'bank-statement':
        return <FileText className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Globe2 className="h-4 w-4" />;
    }
  };
  
  const getItemTypeDisplay = (item: any) => {
    if (item.url === "N/A" || !item.url) {
      return <Badge variant="outline" className="capitalize">{item.type || "Document"}</Badge>;
    }
    return (
      <a 
        href={item.url} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center gap-1 text-blue-400 hover:underline"
      >
        {getItemIcon(item.type || "website")}
        {item.url}
      </a>
    );
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Approval Requests</h1>
          <p className="text-muted-foreground">Review and manage website and document submissions</p>
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
              <Badge variant="outline">{pendingItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <span className="hidden sm:inline">Approved</span>
              <Badge variant="outline">{approvedItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <span className="hidden sm:inline">Rejected</span>
              <Badge variant="outline">{rejectedItems.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type/URL</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItems.length > 0 ? (
                      pendingItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{getItemTypeDisplay(item)}</TableCell>
                          <TableCell>{item.userId}</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {item.username || item.files ? (
                              <Badge className="flex items-center gap-1">
                                <KeyRound className="h-3 w-3" />
                                {item.files ? `${item.files.length} Files` : "Credentials"}
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
                                onClick={() => viewItemDetails(item)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-300"
                                title="Approve"
                                onClick={() => handleApprove(item.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                                title="Reject"
                                onClick={() => handleReject(item.id)}
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
                      <TableHead>Name</TableHead>
                      <TableHead>Type/URL</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Date Approved</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedItems.length > 0 ? (
                      approvedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{getItemTypeDisplay(item)}</TableCell>
                          <TableCell>{item.userId}</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewItemDetails(item)}
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
                          <p>No approved items found</p>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Type/URL</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Date Rejected</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedItems.length > 0 ? (
                      rejectedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{getItemTypeDisplay(item)}</TableCell>
                          <TableCell>{item.userId}</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewItemDetails(item)}
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
                          <p>No rejected items found</p>
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
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Full details for the submission
            </DialogDescription>
          </DialogHeader>
          {selectedWebsite && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{selectedWebsite.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base capitalize">{selectedWebsite.type || "Website"}</p>
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
              
              {selectedWebsite.url && selectedWebsite.url !== "N/A" && (
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
              )}
              
              {selectedWebsite.username && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Login Credentials</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Username</p>
                      <p className="text-base">{selectedWebsite.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Password</p>
                      <p className="text-base">{selectedWebsite.password}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedWebsite.files && selectedWebsite.files.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Files</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedWebsite.files.map((file: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {file.type.includes("image") ? (
                          <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="p-2 bg-muted rounded">PDF</div>
                        )}
                        <div className="text-sm truncate">{file.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
