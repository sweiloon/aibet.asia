import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsites } from "@/context/WebsiteContext";
import { Upload, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openInNewTab } from "@/lib/openInNewTab";

export default function UserWebsites() {
  const { getUserWebsites } = useWebsites();
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);

  const userWebsites = getUserWebsites();

  const activeWebsites = userWebsites.filter(
    (website) => website.status === "approved"
  );
  const pendingWebsites = userWebsites.filter(
    (website) => website.status === "pending"
  );
  const rejectedWebsites = userWebsites.filter(
    (website) => website.status === "rejected"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const viewWebsiteDetails = (website: any) => {
    setSelectedWebsite(website);
    setDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Websites</h1>
            <p className="text-muted-foreground">
              Manage your websites and view their status
            </p>
          </div>

          <Button onClick={() => navigate("/dashboard/websites/add")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Website
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <span>Active</span>
              <Badge variant="outline">{activeWebsites.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <span>Pending</span>
              <Badge variant="outline">{pendingWebsites.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <span>Rejected</span>
              <Badge variant="outline">{rejectedWebsites.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeWebsites.length > 0 ? (
              <Card className="glass-morphism">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Management Records</TableHead>
                        <TableHead>Added On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeWebsites.map((website) => (
                        <TableRow key={website.id}>
                          <TableCell className="font-medium">
                            {website.name}
                          </TableCell>
                          <TableCell>
                            <a
                              href={
                                website.url.startsWith("http")
                                  ? website.url
                                  : `https://${website.url}`
                              }
                              className="text-blue-400 hover:underline"
                              tabIndex={0}
                              role="link"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                openInNewTab(
                                  website.url.startsWith("http")
                                    ? website.url
                                    : `https://${website.url}`
                                );
                              }}
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(website.status)}
                          </TableCell>
                          <TableCell>{website.managementData.length}</TableCell>
                          <TableCell>
                            {new Date(website.createdat).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewWebsiteDetails(website)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/dashboard/websites/${website.id}`)
                                }
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism">
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-xl">No approved websites</p>
                    <p className="text-muted-foreground mt-2">
                      Your approved websites will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingWebsites.length > 0 ? (
              <Card className="glass-morphism">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingWebsites.map((website) => (
                        <TableRow key={website.id}>
                          <TableCell className="font-medium">
                            {website.name}
                          </TableCell>
                          <TableCell>
                            <a
                              href={
                                website.url.startsWith("http")
                                  ? website.url
                                  : `https://${website.url}`
                              }
                              className="text-blue-400 hover:underline"
                              tabIndex={0}
                              role="link"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                openInNewTab(
                                  website.url.startsWith("http")
                                    ? website.url
                                    : `https://${website.url}`
                                );
                              }}
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(website.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(website.createdat).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewWebsiteDetails(website)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism">
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-xl">No pending websites</p>
                    <p className="text-muted-foreground mt-2">
                      Websites awaiting approval will appear here.
                    </p>
                    <Button
                      onClick={() => navigate("/dashboard/websites/add")}
                      className="mt-4"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {rejectedWebsites.length > 0 ? (
              <Card className="glass-morphism">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rejected On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedWebsites.map((website) => (
                        <TableRow key={website.id}>
                          <TableCell className="font-medium">
                            {website.name}
                          </TableCell>
                          <TableCell>
                            <a
                              href={
                                website.url.startsWith("http")
                                  ? website.url
                                  : `https://${website.url}`
                              }
                              className="text-blue-400 hover:underline"
                              tabIndex={0}
                              role="link"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                openInNewTab(
                                  website.url.startsWith("http")
                                    ? website.url
                                    : `https://${website.url}`
                                );
                              }}
                            >
                              {website.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(website.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(website.createdat).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewWebsiteDetails(website)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate("/dashboard/websites/add")
                                }
                              >
                                Resubmit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism">
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-xl">No rejected websites</p>
                    <p className="text-muted-foreground mt-2">
                      Rejected website submissions will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Website Details</DialogTitle>
            <DialogDescription>
              Details for your submitted website
            </DialogDescription>
          </DialogHeader>
          {selectedWebsite && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Website Name
                  </p>
                  <p className="text-base">{selectedWebsite.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    URL
                  </p>
                  <a
                    href={selectedWebsite.url}
                    className="text-blue-400 hover:underline"
                    tabIndex={0}
                    role="link"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      openInNewTab(selectedWebsite.url);
                    }}
                  >
                    {selectedWebsite.url}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedWebsite.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Date Submitted
                  </p>
                  <p className="text-base">
                    {new Date(selectedWebsite.createdat).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Login Credentials
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Username
                    </p>
                    <p className="text-base">
                      {selectedWebsite.username || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Password
                    </p>
                    <p className="text-base">
                      {selectedWebsite.password || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedWebsite.status === "rejected" && (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => navigate("/dashboard/websites/add")}>
                    Resubmit Website
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
