
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Website, WebsiteManagement, useWebsites } from "@/context/WebsiteContext";
import { toast } from "@/components/ui/sonner";

// Import our new components
import { WebsiteHeader } from "@/components/admin/website-detail/WebsiteHeader";
import { WebsiteStatusCard } from "@/components/admin/website-detail/WebsiteStatusCard";
import { UserInfoCard } from "@/components/admin/website-detail/UserInfoCard";
import { SubmissionInfoCard } from "@/components/admin/website-detail/SubmissionInfoCard";
import { RecentManagementCard } from "@/components/admin/website-detail/RecentManagementCard";
import { ManagementTabContent } from "@/components/admin/website-detail/ManagementTabContent";
import { CredentialsTabContent } from "@/components/admin/website-detail/CredentialsTabContent";
import { ManagementRecordDialog } from "@/components/admin/website-detail/ManagementRecordDialog";
import { getStatusBadge } from "@/components/admin/website-detail/StatusBadgeHelper";

export default function AdminWebsiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getAllWebsites,
    updateWebsiteStatus,
    addManagementRecord,
    updateManagementRecord,
    deleteManagementRecord
  } = useWebsites();
  
  const [website, setWebsite] = useState<Website | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<WebsiteManagement | null>(null);
  
  // Load website data
  useEffect(() => {
    const websites = getAllWebsites();
    const foundWebsite = websites.find(site => site.id === id);
    setWebsite(foundWebsite || null);
  }, [id, getAllWebsites]);
  
  const handleStatusChange = (status: Website["status"]) => {
    if (website) {
      updateWebsiteStatus(website.id, status);
      setWebsite({ ...website, status });
      toast.success(`Website status updated to ${status}`);
    }
  };
  
  const handleAddRecord = () => {
    setEditRecord(null);
    setDialogOpen(true);
  };
  
  const handleEditRecord = (record: WebsiteManagement) => {
    setEditRecord(record);
    setDialogOpen(true);
  };
  
  const handleDeleteRecord = (recordId: string) => {
    if (website) {
      if (confirm("Are you sure you want to delete this record?")) {
        deleteManagementRecord(website.id, recordId);
        
        // Refresh website data
        const websites = getAllWebsites();
        const updatedWebsite = websites.find(site => site.id === id);
        setWebsite(updatedWebsite || null);
        
        toast.success("Management record deleted successfully");
      }
    }
  };
  
  const handleSaveRecord = (date: string, tasks: any[]) => {
    if (website) {
      if (editRecord) {
        // Update existing record
        updateManagementRecord(website.id, editRecord.id, {
          tasks: tasks,
          date: new Date(date).toISOString()
        });
        toast.success("Management record updated successfully");
      } else {
        // Add new record
        addManagementRecord(website.id, {
          date: new Date(date).toISOString(),
          tasks: tasks,
          day: "Day 1", // Adding default values for the new fields
          credit: 0,
          profit: 0,
          grossProfit: 0,
          serviceFee: 0,
          startDate: date,
          endDate: date,
          netProfit: 0
        });
        toast.success("Management record added successfully");
      }
      
      // Reset form and close dialog
      setDialogOpen(false);
      setEditRecord(null);
      
      // Refresh website data
      const websites = getAllWebsites();
      const updatedWebsite = websites.find(site => site.id === id);
      setWebsite(updatedWebsite || null);
    }
  };
  
  if (!website) {
    return (
      <DashboardLayout isAdmin>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Website not found</h2>
          <Button 
            onClick={() => navigate("/admin/websites")}
            className="mt-4"
          >
            Back to Websites
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <WebsiteHeader 
          website={website} 
          onBack={() => navigate("/admin/websites")} 
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Management</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <WebsiteStatusCard 
                website={website} 
                onStatusChange={handleStatusChange} 
              />
              <UserInfoCard website={website} />
              <SubmissionInfoCard website={website} />
            </div>
            
            <RecentManagementCard 
              website={website}
              onEditRecord={handleEditRecord}
              onDeleteRecord={handleDeleteRecord}
              onAddRecord={handleAddRecord}
              onViewAllRecords={() => setActiveTab("manage")}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-6 mt-6">
            <ManagementTabContent 
              website={website}
              onEditRecord={handleEditRecord}
              onDeleteRecord={handleDeleteRecord}
              onAddRecord={handleAddRecord}
            />
          </TabsContent>
          
          <TabsContent value="credentials" className="mt-6">
            <CredentialsTabContent website={website} />
          </TabsContent>
        </Tabs>
        
        <ManagementRecordDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveRecord}
          editRecord={editRecord}
          websiteName={website.name}
        />
      </div>
    </DashboardLayout>
  );
}
