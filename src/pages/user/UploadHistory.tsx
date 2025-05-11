
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWebsites } from "@/context/WebsiteContext";
import { Eye } from "lucide-react";

export default function UploadHistory() {
  const { getUserWebsites } = useWebsites();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const userUploads = getUserWebsites();
  
  // Filter uploads by type and status
  const websiteUploads = userUploads.filter(item => item.type === 'website');
  const documentUploads = userUploads.filter(item => item.type === 'document');
  
  const approvedUploads = userUploads.filter(item => item.status === "approved");
  const pendingUploads = userUploads.filter(item => item.status === "pending");
  const rejectedUploads = userUploads.filter(item => item.status === "rejected");
  
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "website":
        return <Badge variant="outline">Website</Badge>;
      case "document":
        return <Badge variant="outline">Document</Badge>;
      case "id-card":
        return <Badge variant="outline">ID Card</Badge>;
      case "bank-statement":
        return <Badge variant="outline">Bank Statement</Badge>;
      default:
        return null;
    }
  };
  
  const viewDetails = (item: any) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload History</h1>
          <p className="text-muted-foreground">View all your previous upload submissions</p>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <span>All</span>
              <Badge variant="outline">{userUploads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <span>Approved</span>
              <Badge variant="outline">{approvedUploads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <span>Pending</span>
              <Badge variant="outline">{pendingUploads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <span>Rejected</span>
              <Badge variant="outline">{rejectedUploads.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          {/* All uploads tab content */}
          <TabsContent value="all">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userUploads.length > 0 ? (
                      userUploads.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell className="font-medium">{upload.name}</TableCell>
                          <TableCell>{getTypeBadge(upload.type || "website")}</TableCell>
                          <TableCell>{getStatusBadge(upload.status)}</TableCell>
                          <TableCell>{new Date(upload.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewDetails(upload)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <p>No upload history found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Approved tab content */}
          <TabsContent value="approved">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedUploads.length > 0 ? (
                      approvedUploads.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell className="font-medium">{upload.name}</TableCell>
                          <TableCell>{getTypeBadge(upload.type || "website")}</TableCell>
                          <TableCell>{getStatusBadge(upload.status)}</TableCell>
                          <TableCell>{new Date(upload.updatedAt || upload.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewDetails(upload)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <p>No approved uploads found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pending tab content */}
          <TabsContent value="pending">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUploads.length > 0 ? (
                      pendingUploads.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell className="font-medium">{upload.name}</TableCell>
                          <TableCell>{getTypeBadge(upload.type || "website")}</TableCell>
                          <TableCell>{getStatusBadge(upload.status)}</TableCell>
                          <TableCell>{new Date(upload.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewDetails(upload)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <p>No pending uploads found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rejected tab content */}
          <TabsContent value="rejected">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rejected On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedUploads.length > 0 ? (
                      rejectedUploads.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell className="font-medium">{upload.name}</TableCell>
                          <TableCell>{getTypeBadge(upload.type || "website")}</TableCell>
                          <TableCell>{getStatusBadge(upload.status)}</TableCell>
                          <TableCell>{new Date(upload.updatedAt || upload.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewDetails(upload)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <p>No rejected uploads found</p>
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

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Details for your submitted item
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base capitalize">{selectedItem.type || "Website"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                  <p className="text-base">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedItem.url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">URL</p>
                  <a 
                    href={selectedItem.url.startsWith("http") ? selectedItem.url : `https://${selectedItem.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {selectedItem.url}
                  </a>
                </div>
              )}
              
              {selectedItem.username && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Login Credentials</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Username</p>
                      <p className="text-base">{selectedItem.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Password</p>
                      <p className="text-base">••••••••</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedItem.files && selectedItem.files.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Files</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.files.map((file: any, index: number) => (
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
              
              {selectedItem.status === "rejected" && selectedItem.rejectionReason && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                  <p className="text-base text-red-400">{selectedItem.rejectionReason}</p>
                </div>
              )}
              
              {selectedItem.status === "rejected" && (
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => {
                      setDetailsOpen(false);
                      // Navigate to appropriate upload page based on type
                      if (selectedItem.type === "website") {
                        // history.push("/dashboard/websites/add");
                      } else {
                        // history.push("/dashboard/upload-document");
                      }
                    }}
                  >
                    Resubmit
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
