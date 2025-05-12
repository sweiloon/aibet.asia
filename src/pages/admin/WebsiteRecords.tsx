
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites, Website, WebsiteManagement } from "@/context/WebsiteContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { format } from 'date-fns';
import { toast } from "@/components/ui/sonner";

const WebsiteRecords = () => {
  const { websites, addManagementRecord, updateManagementRecord, deleteManagementRecord, updateWebsite } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<WebsiteManagement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
      (website.userId && website.userId.toLowerCase().includes(searchTermLower)) ||
      (website.userEmail && website.userEmail.toLowerCase().includes(searchTermLower))
    );
  });

  // Form states
  const [formDate, setFormDate] = useState("");
  const [formTasks, setFormTasks] = useState<{ type: string; description: string; status: "completed" | "in-progress" | "pending" }[]>([
    { type: "", description: "", status: "pending" }
  ]);

  // Reset form
  const resetForm = () => {
    setFormDate("");
    setFormTasks([{ type: "", description: "", status: "pending" }]);
  };

  // Handle add record
  const handleAddRecord = () => {
    if (!selectedWebsite) return;
    
    addManagementRecord(selectedWebsite.id, {
      date: formDate,
      tasks: formTasks,
    });
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle edit record
  const handleEditRecord = () => {
    if (!selectedWebsite || !selectedRecord) return;
    
    updateManagementRecord(selectedWebsite.id, selectedRecord.id, formTasks);
    
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
  };

  // Handle delete record
  const handleDeleteRecord = (websiteId: string, recordId: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteManagementRecord(websiteId, recordId);
      toast.success("Record deleted successfully");
    }
  };
  
  // Handle clear all records for a website
  const handleClearAllRecords = (websiteId: string) => {
    if (confirm("Are you sure you want to clear all records for this website? This action cannot be undone.")) {
      const website = websites.find(w => w.id === websiteId);
      if (website) {
        const updatedWebsite = {
          ...website,
          managementData: []
        };
        updateWebsite(updatedWebsite);
        toast.success("All records cleared successfully");
      }
    }
  };

  // Add task field
  const addTaskField = () => {
    setFormTasks([...formTasks, { type: "", description: "", status: "pending" }]);
  };

  // Remove task field
  const removeTaskField = (index: number) => {
    const newTasks = [...formTasks];
    newTasks.splice(index, 1);
    setFormTasks(newTasks);
  };

  // Update task field
  const updateTaskField = (index: number, field: keyof typeof formTasks[0], value: string) => {
    const newTasks = [...formTasks];
    if (field === "status") {
      newTasks[index][field] = value as "completed" | "in-progress" | "pending";
    } else {
      newTasks[index][field] = value;
    }
    setFormTasks(newTasks);
  };

  // Prepare edit dialog
  const prepareEditDialog = (website: Website, record: WebsiteManagement) => {
    setSelectedWebsite(website);
    setSelectedRecord(record);
    setFormDate(record.date);
    setFormTasks(record.tasks);
    setIsEditDialogOpen(true);
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
                <h2 className="text-xl font-semibold">{website.name}</h2>
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
                    <span>Add Record</span>
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
                              onClick={() => prepareEditDialog(website, record)}
                            >
                              <Pencil className="h-4 w-4" />
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
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Tasks</Label>
                {formTasks.map((task, index) => (
                  <div key={index} className="grid gap-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`task-type-${index}`}>Type</Label>
                        <Input
                          id={`task-type-${index}`}
                          value={task.type}
                          onChange={(e) => updateTaskField(index, "type", e.target.value)}
                          placeholder="Maintenance, Update, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`task-status-${index}`}>Status</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value) => updateTaskField(index, "status", value)}
                        >
                          <SelectTrigger id={`task-status-${index}`}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`task-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`task-desc-${index}`}
                        value={task.description}
                        onChange={(e) => updateTaskField(index, "description", e.target.value)}
                        placeholder="Task description"
                        rows={2}
                      />
                    </div>
                    {formTasks.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTaskField(index)}
                        className="w-full"
                      >
                        Remove Task
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTaskField} className="w-full">
                  Add Task
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddRecord}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Record Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Management Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  disabled
                />
              </div>
              
              <div className="space-y-4">
                <Label>Tasks</Label>
                {formTasks.map((task, index) => (
                  <div key={index} className="grid gap-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`edit-task-type-${index}`}>Type</Label>
                        <Input
                          id={`edit-task-type-${index}`}
                          value={task.type}
                          onChange={(e) => updateTaskField(index, "type", e.target.value)}
                          placeholder="Maintenance, Update, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-task-status-${index}`}>Status</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value) => updateTaskField(index, "status", value)}
                        >
                          <SelectTrigger id={`edit-task-status-${index}`}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edit-task-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`edit-task-desc-${index}`}
                        value={task.description}
                        onChange={(e) => updateTaskField(index, "description", e.target.value)}
                        placeholder="Task description"
                        rows={2}
                      />
                    </div>
                    {formTasks.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTaskField(index)}
                        className="w-full"
                      >
                        Remove Task
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTaskField} className="w-full">
                  Add Task
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditRecord}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteRecords;
