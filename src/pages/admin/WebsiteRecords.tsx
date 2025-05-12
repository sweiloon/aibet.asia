
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites, Website, WebsiteManagement } from "@/context/WebsiteContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Plus, Search, X, Mail } from "lucide-react";
import { format } from 'date-fns';
import { toast } from "@/components/ui/sonner";

const WebsiteRecords = () => {
  const { websites, addManagementRecord, updateManagementRecord, deleteManagementRecord, clearAllManagementRecords } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState<{recordId: string, field: string} | null>(null);

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

  // Form states for adding a new record
  const [formValues, setFormValues] = useState<Omit<WebsiteManagement, "id" | "websiteId">>({
    day: "",
    credit: 0,
    profit: 0,
    grossProfit: 0,
    serviceFee: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    netProfit: 0
  });

  // Form state for editing a single field
  const [editValue, setEditValue] = useState<string | number>("");

  // Reset form
  const resetForm = () => {
    setFormValues({
      day: "",
      credit: 0,
      profit: 0,
      grossProfit: 0,
      serviceFee: 0,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      netProfit: 0
    });
  };

  // Handle input change for add form
  const handleInputChange = (field: keyof Omit<WebsiteManagement, "id" | "websiteId">, value: string | number) => {
    const numericFields = ["credit", "profit", "grossProfit", "serviceFee", "netProfit"];
    
    if (numericFields.includes(field)) {
      setFormValues({
        ...formValues,
        [field]: Number(value)
      });
    } else {
      setFormValues({
        ...formValues,
        [field]: value
      });
    }
  };

  // Handle add record
  const handleAddRecord = () => {
    if (!selectedWebsite) return;
    
    addManagementRecord(selectedWebsite.id, formValues);
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle edit field (open dialog)
  const handleEditField = (websiteId: string, recordId: string, field: string, currentValue: any) => {
    setSelectedWebsite(websites.find(w => w.id === websiteId) || null);
    setEditingRecord({ recordId, field });
    setEditValue(currentValue);
    setIsEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!selectedWebsite || !editingRecord) return;

    const field = editingRecord.field as keyof WebsiteManagement;
    const numericFields = ["credit", "profit", "grossProfit", "serviceFee", "netProfit"];
    let value = editValue;
    
    if (numericFields.includes(field)) {
      value = Number(editValue);
    }

    updateManagementRecord(selectedWebsite.id, editingRecord.recordId, { [field]: value });
    
    setIsEditDialogOpen(false);
    setEditingRecord(null);
    setEditValue("");
  };

  // Handle delete record
  const handleDeleteRecord = (websiteId: string, recordId: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteManagementRecord(websiteId, recordId);
    }
  };
  
  // Handle clear all records for a website
  const handleClearAllRecords = (websiteId: string) => {
    if (confirm("Are you sure you want to clear all records for this website? This action cannot be undone.")) {
      clearAllManagementRecords(websiteId);
    }
  };

  // Prepare add dialog
  const prepareAddDialog = (website: Website) => {
    setSelectedWebsite(website);
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Show website details
  const showWebsiteDetails = (website: Website) => {
    setSelectedWebsite(website);
    setIsDetailOpen(true);
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
          filteredWebsites.map((website) => (
            <div key={website.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{website.name}</h2>
                  {website.userEmail && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{website.userEmail}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleClearAllRecords(website.id)} 
                    variant="destructive" 
                    size="sm" 
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Records</span>
                  </Button>
                  <Button 
                    onClick={() => prepareAddDialog(website)} 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Day</span>
                  </Button>
                </div>
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
                      <TableHead>Day</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Gross Profit</TableHead>
                      <TableHead>Service Fee</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Net Profit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {website.managementData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.day}</TableCell>
                        <TableCell>{record.credit}</TableCell>
                        <TableCell>{record.profit}</TableCell>
                        <TableCell>{record.grossProfit}</TableCell>
                        <TableCell>{record.serviceFee}</TableCell>
                        <TableCell>{record.startDate}</TableCell>
                        <TableCell>{record.endDate}</TableCell>
                        <TableCell>{record.netProfit}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => showWebsiteDetails(website)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteRecord(website.id, record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                
                {selectedWebsite.userEmail && (
                  <div>
                    <Label>User Email</Label>
                    <div className="font-medium">{selectedWebsite.userEmail}</div>
                  </div>
                )}
                
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
                
                {selectedWebsite.username && (
                  <div>
                    <Label>Username</Label>
                    <div className="font-medium">{selectedWebsite.username}</div>
                  </div>
                )}
                
                {selectedWebsite.password && (
                  <div>
                    <Label>Password</Label>
                    <div className="font-medium">{selectedWebsite.password}</div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button onClick={() => setIsDetailOpen(false)} className="w-full">Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Add Record Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Management Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Input
                    id="day"
                    value={formValues.day}
                    onChange={(e) => handleInputChange("day", e.target.value)}
                    placeholder="Day number or name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit">Credit</Label>
                  <Input
                    id="credit"
                    type="number"
                    value={formValues.credit}
                    onChange={(e) => handleInputChange("credit", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profit">Profit</Label>
                  <Input
                    id="profit"
                    type="number"
                    value={formValues.profit}
                    onChange={(e) => handleInputChange("profit", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grossProfit">Gross Profit</Label>
                  <Input
                    id="grossProfit"
                    type="number"
                    value={formValues.grossProfit}
                    onChange={(e) => handleInputChange("grossProfit", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceFee">Service Fee</Label>
                  <Input
                    id="serviceFee"
                    type="number"
                    value={formValues.serviceFee}
                    onChange={(e) => handleInputChange("serviceFee", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="netProfit">Net Profit</Label>
                  <Input
                    id="netProfit"
                    type="number"
                    value={formValues.netProfit}
                    onChange={(e) => handleInputChange("netProfit", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formValues.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formValues.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddRecord}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Field Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit {editingRecord?.field}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value</Label>
                {editingRecord?.field === "startDate" || editingRecord?.field === "endDate" ? (
                  <Input
                    id="edit-value"
                    type="date"
                    value={editValue as string}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : ["credit", "profit", "grossProfit", "serviceFee", "netProfit"].includes(editingRecord?.field || "") ? (
                  <Input
                    id="edit-value"
                    type="number"
                    value={editValue as number}
                    onChange={(e) => setEditValue(Number(e.target.value))}
                  />
                ) : (
                  <Input
                    id="edit-value"
                    value={editValue as string}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteRecords;
