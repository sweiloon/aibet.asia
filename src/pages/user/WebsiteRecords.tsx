
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites, Website } from "@/context/WebsiteContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Eye } from "lucide-react";

const WebsiteRecords = () => {
  const { user } = useAuth();
  const { websites } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Only show approved websites of type "website" that belong to the current user
  const userApprovedWebsites = user ? 
    websites.filter(website => 
      website.userId === user.id && 
      website.status === "approved" &&
      website.type === "website"
    ) : 
    [];

  // Filter websites based on search term
  const filteredWebsites = userApprovedWebsites.filter(website =>
    !searchTerm || website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show website details
  const showWebsiteDetails = (website: Website) => {
    setSelectedWebsite(website);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Website Records</h1>
        </div>
        
        {userApprovedWebsites.length > 0 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
        
        {filteredWebsites.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <p className="text-muted-foreground">
              {userApprovedWebsites.length === 0 
                ? "You don't have any approved websites yet" 
                : "No websites found matching your search"}
            </p>
            {searchTerm && (
              <Button
                variant="link"
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          filteredWebsites.map((website) => (
            <div key={website.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{website.name}</h2>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <a href={website.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {website.url}
                </a>
              </div>
              
              {website.managementData.length === 0 ? (
                <div className="text-center p-6 border rounded-lg">
                  <p className="text-muted-foreground">No management records yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {website.managementData
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.date}
                          </TableCell>
                          <TableCell>
                            <div className="max-h-24 overflow-auto">
                              {record.tasks.map((task, idx) => (
                                <div key={idx} className="mb-1">
                                  <span className="font-semibold">{task.type || "Task"}: </span>
                                  {task.description}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.tasks.some(t => t.status === "completed") ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : record.tasks.some(t => t.status === "in-progress") ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                In Progress
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => showWebsiteDetails(website)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ))
        )}
        
        {/* Website Details Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Website Details</DialogTitle>
            </DialogHeader>
            {selectedWebsite && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <div className="font-medium">{selectedWebsite.name}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="font-medium capitalize">{selectedWebsite.status}</div>
                  </div>
                </div>
                
                <div>
                  <Label>URL</Label>
                  <div className="font-medium">
                    <a href={selectedWebsite.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {selectedWebsite.url}
                    </a>
                  </div>
                </div>
                
                {selectedWebsite.loginUrl && (
                  <div>
                    <Label>Login URL</Label>
                    <div className="font-medium">
                      <a href={selectedWebsite.loginUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {selectedWebsite.loginUrl}
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button onClick={() => setIsDetailOpen(false)} className="w-full">Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteRecords;
