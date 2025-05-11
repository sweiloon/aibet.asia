
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Website, WebsiteManagement, useWebsites } from "@/context/WebsiteContext";
import { toast } from "@/components/ui/sonner";

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
  const [newRecordDate, setNewRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [tasks, setTasks] = useState<any[]>([
    { type: "Backup", description: "Full website backup", status: "completed" },
    { type: "Security", description: "Security scan and updates", status: "completed" },
    { type: "Performance", description: "Performance optimization", status: "pending" }
  ]);
  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  
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
  
  const handleAddTask = () => {
    setTasks([
      ...tasks,
      { type: "Other", description: "", status: "pending" }
    ]);
  };
  
  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };
  
  const handleTaskChange = (index: number, field: string, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };
  
  const handleAddRecord = () => {
    if (website) {
      if (editRecordId) {
        // Update existing record
        updateManagementRecord(website.id, editRecordId, tasks);
        toast.success("Management record updated successfully");
      } else {
        // Add new record
        addManagementRecord(website.id, {
          date: new Date(newRecordDate).toISOString(),
          tasks
        });
        toast.success("Management record added successfully");
      }
      
      // Reset form
      setDialogOpen(false);
      setEditRecordId(null);
      setNewRecordDate(new Date().toISOString().split("T")[0]);
      setTasks([
        { type: "Backup", description: "Full website backup", status: "completed" },
        { type: "Security", description: "Security scan and updates", status: "completed" },
        { type: "Performance", description: "Performance optimization", status: "pending" }
      ]);
      
      // Refresh website data
      const websites = getAllWebsites();
      const updatedWebsite = websites.find(site => site.id === id);
      setWebsite(updatedWebsite || null);
    }
  };
  
  const handleEditRecord = (record: WebsiteManagement) => {
    setEditRecordId(record.id);
    setNewRecordDate(new Date(record.date).toISOString().split("T")[0]);
    setTasks(record.tasks);
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">Pending</Badge>;
    }
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold">{website.name}</h1>
              {getStatusBadge(website.status)}
            </div>
            <a 
              href={website.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              {website.url}
            </a>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate("/admin/websites")}
          >
            Back to Websites
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Management</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                  <CardDescription>Current website status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={website.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>User Info</CardTitle>
                  <CardDescription>Website owner details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">User ID:</span>
                      <div className="font-medium">{website.userId}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <div className="font-medium">user@aibet.asia</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Submission Info</CardTitle>
                  <CardDescription>Website submission details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Submitted On:</span>
                      <div className="font-medium">{new Date(website.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Management Records:</span>
                      <div className="font-medium">{website.managementData.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Recent Management Activities</CardTitle>
                <CardDescription>Latest records for this website</CardDescription>
              </CardHeader>
              <CardContent>
                {website.managementData.length > 0 ? (
                  <div className="space-y-4">
                    {[...website.managementData]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 3)
                      .map(record => (
                        <div key={record.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditRecord(record)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRecord(record.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {record.tasks.map((task, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <div>
                                  <span className="font-semibold">{task.type}:</span> {task.description}
                                </div>
                                <div>
                                  {getStatusBadge(task.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                    {website.managementData.length > 3 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab("manage")}
                      >
                        View All Records
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p>No management records yet</p>
                    <Button
                      onClick={() => setDialogOpen(true)}
                      className="mt-4"
                    >
                      Add First Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Management Records</h2>
              <Button onClick={() => setDialogOpen(true)}>
                Add New Record
              </Button>
            </div>
            
            {website.managementData.length > 0 ? (
              <Card className="glass-morphism">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Tasks</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...website.managementData]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(record => {
                          const completedCount = record.tasks.filter(
                            task => task.status === "completed"
                          ).length;
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {new Date(record.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{record.tasks.length} tasks</TableCell>
                              <TableCell>
                                {completedCount}/{record.tasks.length}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditRecord(record)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteRecord(record.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism">
                <CardContent className="py-10">
                  <div className="text-center">
                    <p>No management records yet</p>
                    <Button
                      onClick={() => setDialogOpen(true)}
                      className="mt-4"
                    >
                      Add First Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editRecordId ? "Edit Management Record" : "Add Management Record"}
                  </DialogTitle>
                  <DialogDescription>
                    Record management tasks performed on {website.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="record-date">Record Date</Label>
                    <Input
                      id="record-date"
                      type="date"
                      value={newRecordDate}
                      onChange={(e) => setNewRecordDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Tasks</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTask}
                      >
                        Add Task
                      </Button>
                    </div>
                    
                    {tasks.map((task, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-3">
                          <Select
                            value={task.type}
                            onValueChange={(value) => handleTaskChange(index, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Backup">Backup</SelectItem>
                              <SelectItem value="Security">Security</SelectItem>
                              <SelectItem value="Performance">Performance</SelectItem>
                              <SelectItem value="Content">Content</SelectItem>
                              <SelectItem value="SEO">SEO</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-5">
                          <Textarea
                            placeholder="Description"
                            value={task.description}
                            onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                            className="min-h-9 resize-none"
                          />
                        </div>
                        
                        <div className="col-span-3">
                          <Select
                            value={task.status}
                            onValueChange={(value) => handleTaskChange(index, "status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-1 flex justify-center items-center h-9">
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => handleRemoveTask(index)}
                            disabled={tasks.length <= 1}
                            className="h-8 w-8"
                          >
                            &times;
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddRecord}>
                    {editRecordId ? "Update Record" : "Add Record"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="credentials" className="mt-6">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Website Credentials</CardTitle>
                <CardDescription>
                  Access credentials for website management
                </CardDescription>
              </CardHeader>
              <CardContent>
                {website.loginUrl ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Admin Login URL</Label>
                      <div className="flex">
                        <Input
                          readOnly
                          value={website.loginUrl}
                          className="rounded-r-none"
                        />
                        <Button
                          className="rounded-l-none"
                          onClick={() => window.open(website.loginUrl, "_blank")}
                        >
                          Visit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input readOnly value={website.username} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input readOnly type="password" value={website.password} />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 text-sm text-yellow-300">
                      <strong>Note:</strong> These credentials are used for website management only.
                      They are stored securely and only accessible by authorized admins.
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p>No credentials provided for this website.</p>
                    <p className="text-muted-foreground text-sm mt-2">
                      The user did not include admin credentials when submitting this website.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
