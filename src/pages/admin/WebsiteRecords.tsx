
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsites } from "@/context/WebsiteContext";
import { Search, Plus, Edit, Trash2, Info } from "lucide-react";
import { AddRecordDialog } from "@/components/admin/AddRecordDialog";
import { EditRecordDialog } from "@/components/admin/EditRecordDialog";
import { toast } from "@/components/ui/sonner";

export default function WebsiteRecords() {
  const { getAllWebsites, addManagementRecord, updateManagementRecord, deleteManagementRecord } = useWebsites();
  const navigate = useNavigate();
  
  // Get approved websites only
  const websites = getAllWebsites().filter(website => website.status === "approved");
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  const filteredWebsites = websites.filter(website => 
    !searchTerm || website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecord = (websiteId: string) => {
    setSelectedWebsite(websiteId);
    setIsAddDialogOpen(true);
  };

  const handleEditRecord = (websiteId: string, recordId: string) => {
    setSelectedWebsite(websiteId);
    setSelectedRecord(recordId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRecord = (websiteId: string, recordId: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteManagementRecord(websiteId, recordId);
      toast.success("Record deleted successfully");
    }
  };

  const handleViewWebsiteDetails = (websiteId: string) => {
    navigate(`/admin/websites/${websiteId}`);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Website Records</h1>
          <p className="text-muted-foreground">Manage daily records for approved websites</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {filteredWebsites.length > 0 ? (
          <div className="space-y-8">
            {filteredWebsites.map(website => (
              <Card key={website.id} className="glass-morphism">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{website.name}</h2>
                    <Button 
                      onClick={() => handleAddRecord(website.id)}
                      className="flex items-center"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Day
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Credit</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Gross Profit</TableHead>
                        <TableHead>Service Fee</TableHead>
                        <TableHead>Net Profit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {website.managementData.length > 0 ? (
                        website.managementData.map((record, index) => {
                          // Extract financial data from tasks
                          const creditTask = record.tasks.find(t => t.type === "credit");
                          const profitTask = record.tasks.find(t => t.type === "profit");
                          const grossProfitTask = record.tasks.find(t => t.type === "gross_profit");
                          const serviceFeeTask = record.tasks.find(t => t.type === "service_fee");
                          const netProfitTask = record.tasks.find(t => t.type === "net_profit");
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                              <TableCell>{creditTask?.description || "-"}</TableCell>
                              <TableCell>{profitTask?.description || "-"}</TableCell>
                              <TableCell>{grossProfitTask?.description || "-"}</TableCell>
                              <TableCell>{serviceFeeTask?.description || "-"}</TableCell>
                              <TableCell>{netProfitTask?.description || "-"}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditRecord(website.id, record.id)}
                                    title="Edit Record"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteRecord(website.id, record.id)}
                                    title="Delete Record"
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleViewWebsiteDetails(website.id)}
                                    title="View Website Details"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No records available yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-morphism">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <p>No approved websites found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Once websites are approved, they will appear here for record management
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Dialogs */}
      {selectedWebsite && (
        <>
          <AddRecordDialog 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            websiteId={selectedWebsite}
          />
          
          {selectedRecord && (
            <EditRecordDialog 
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              websiteId={selectedWebsite}
              recordId={selectedRecord}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
