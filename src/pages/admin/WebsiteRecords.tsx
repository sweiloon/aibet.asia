
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites, Website } from "@/context/WebsiteContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { WebsiteRecordCard } from "@/components/admin/WebsiteRecordCard";
import { RecordForm } from "@/components/admin/RecordForm";

const WebsiteRecords = () => {
  const { websites, addManagementRecord, updateManagementRecord, deleteManagementRecord, clearAllManagementRecords } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Only approved websites of type "website"
  const approvedWebsites = websites.filter(website => 
    website.status === "approved" && website.type === "website"
  );

  // Apply search
  const filteredWebsites = approvedWebsites.filter(website => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      website.name.toLowerCase().includes(searchTermLower) ||
      (website.userEmail && website.userEmail.toLowerCase().includes(searchTermLower))
    );
  });

  // Handle add record dialog
  const prepareAddDialog = (website: Website) => {
    setSelectedWebsite(website);
    setIsAddDialogOpen(true);
  };

  // Handle add record
  const handleAddRecord = (formValues: any) => {
    if (!selectedWebsite) return;
    
    addManagementRecord(selectedWebsite.id, formValues);
    
    setIsAddDialogOpen(false);
    setSelectedWebsite(null);
    toast.success("Record added successfully");
  };

  // Handle edit field
  const handleEditField = (websiteId: string, recordId: string, field: string, value: any) => {
    updateManagementRecord(websiteId, recordId, { [field]: value });
    toast.success(`${field} updated successfully`);
  };

  // Handle delete record
  const handleDeleteRecord = (websiteId: string, recordId: string) => {
    deleteManagementRecord(websiteId, recordId);
    toast.success("Record deleted successfully");
  };
  
  // Handle clear all records for a website
  const handleClearAllRecords = (websiteId: string) => {
    clearAllManagementRecords(websiteId);
    toast.success("All records cleared successfully");
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Website Records</h1>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by website name or user email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <button 
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {filteredWebsites.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <p className="text-muted-foreground">
              {approvedWebsites.length === 0 
                ? "No approved websites found" 
                : "No websites found matching your search"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredWebsites.map((website) => (
              <WebsiteRecordCard
                key={website.id}
                website={website}
                onAddRecord={prepareAddDialog}
                onDeleteRecord={handleDeleteRecord}
                onClearRecords={handleClearAllRecords}
                onEditField={handleEditField}
              />
            ))}
          </div>
        )}
        
        {/* Add Record Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Management Record</DialogTitle>
            </DialogHeader>
            <RecordForm 
              onSave={handleAddRecord}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteRecords;
