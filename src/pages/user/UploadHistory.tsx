
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWebsites } from "@/context/WebsiteContext";
import { UploadHistoryTable } from "@/components/upload-history/UploadHistoryTable";
import { UploadDetailsDialog } from "@/components/upload-history/UploadDetailsDialog";
import { Website } from "@/context/WebsiteContext";

export default function UploadHistory() {
  const { getUserWebsites } = useWebsites();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Website | null>(null);
  
  const userUploads = getUserWebsites();
  
  // Filter uploads by status
  const approvedUploads = userUploads.filter(item => item.status === "approved");
  const pendingUploads = userUploads.filter(item => item.status === "pending");
  const rejectedUploads = userUploads.filter(item => item.status === "rejected");
  
  const viewDetails = (item: Website) => {
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
                <UploadHistoryTable 
                  uploads={userUploads} 
                  onViewDetails={viewDetails} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Approved tab content */}
          <TabsContent value="approved">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable 
                  uploads={approvedUploads} 
                  onViewDetails={viewDetails} 
                  title="Approved On"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pending tab content */}
          <TabsContent value="pending">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable 
                  uploads={pendingUploads} 
                  onViewDetails={viewDetails}
                  title="Submitted On"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rejected tab content */}
          <TabsContent value="rejected">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable 
                  uploads={rejectedUploads} 
                  onViewDetails={viewDetails} 
                  title="Rejected On"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UploadDetailsDialog 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        item={selectedItem} 
      />
    </DashboardLayout>
  );
}
