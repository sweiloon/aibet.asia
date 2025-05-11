
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Search } from "lucide-react";

export default function AdminWebsites() {
  const { getAllWebsites } = useWebsites();
  const websites = getAllWebsites();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Set initial status filter based on URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status) {
      setStatusFilter(status);
    }
  }, [location.search]);
  
  const filteredWebsites = websites.filter(website => {
    const matchesStatus = !statusFilter || website.status === statusFilter;
    const matchesSearch = !searchTerm || 
      website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
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
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Websites</h1>
          <p className="text-muted-foreground">Review and manage all websites in the system</p>
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
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card className="glass-morphism">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebsites.length > 0 ? (
                  filteredWebsites.map((website) => {
                    // Get user info (in a real app would fetch from database)
                    const userEmail = "user@aibet.asia"; // Placeholder
                    
                    return (
                      <TableRow key={website.id}>
                        <TableCell className="font-medium">{website.name}</TableCell>
                        <TableCell>
                          <a 
                            href={website.url.startsWith("http") ? website.url : `https://${website.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {website.url}
                          </a>
                        </TableCell>
                        <TableCell>{getStatusBadge(website.status)}</TableCell>
                        <TableCell>{userEmail}</TableCell>
                        <TableCell>{new Date(website.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{website.managementData.length}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/websites/${website.id}`)}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <p>No websites found matching your filters</p>
                      {statusFilter && (
                        <Button
                          variant="link"
                          onClick={() => setStatusFilter("")}
                          className="mt-2"
                        >
                          Clear status filter
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
