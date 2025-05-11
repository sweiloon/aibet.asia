
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export default function UserWebsiteRecords() {
  const { getUserWebsites } = useWebsites();
  
  // Get user's approved websites only
  const websites = getUserWebsites().filter(website => website.status === "approved");
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const filteredWebsites = websites.filter(website => 
    !searchTerm || website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Website Records</h1>
          <p className="text-muted-foreground">View management records for your approved websites</p>
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
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">{website.name}</h2>
                    <p className="text-muted-foreground text-sm">{website.url}</p>
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
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
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
                  Once your websites are approved, management records will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
