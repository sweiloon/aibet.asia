import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useWebsites } from "@/context/WebsiteContext";
import { useToast } from "@/hooks/use-toast";
import { ApprovalsTable } from "@/components/admin/ApprovalsTable";
import { ItemDetailsDialog } from "@/components/admin/ItemDetailsDialog";
import { Website } from "@/context/WebsiteContext";
import { useTranslation } from "react-i18next";

export default function AdminApprovals() {
  const { t, i18n } = useTranslation();
  const { getAllWebsites, updateWebsiteStatus, deleteWebsite } = useWebsites();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

  // Get all websites from context
  const allWebsites = getAllWebsites();

  // Filter for pending websites and documents
  const pendingItems = allWebsites.filter(
    (item) =>
      item.status === "pending" &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Filter for approved websites and documents
  const approvedItems = allWebsites.filter(
    (item) =>
      item.status === "approved" &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Filter for rejected websites and documents
  const rejectedItems = allWebsites.filter(
    (item) =>
      item.status === "rejected" &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleApprove = (itemId: string) => {
    updateWebsiteStatus(itemId, "approved");
    toast({
      title: t("Item approved"),
      description: t("The item has been approved."),
    });
  };

  const handleReject = (itemId: string) => {
    updateWebsiteStatus(itemId, "rejected");
    toast({
      title: t("Item rejected"),
      description: t("The item has been rejected."),
    });
  };

  const viewItemDetails = (item: Website) => {
    setSelectedWebsite(item);
    setDetailsOpen(true);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Approval Requests")}</h1>
          <p className="text-muted-foreground">
            {t("Review and manage website and document submissions")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search requests...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <span className="hidden sm:inline">{t("Pending Approvals")}</span>
              <Badge variant="outline">{pendingItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <span className="hidden sm:inline">{t("Approved")}</span>
              <Badge variant="outline">{approvedItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <span className="hidden sm:inline">{t("Rejected")}</span>
              <Badge variant="outline">{rejectedItems.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <ApprovalsTable
                  items={pendingItems}
                  onViewDetails={viewItemDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showActions={true}
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm("")}
                  deleteWebsite={deleteWebsite}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <ApprovalsTable
                  items={approvedItems}
                  onViewDetails={viewItemDetails}
                  title={t("Date Approved")}
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm("")}
                  deleteWebsite={deleteWebsite}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <ApprovalsTable
                  items={rejectedItems}
                  onViewDetails={viewItemDetails}
                  title={t("Date Rejected")}
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm("")}
                  deleteWebsite={deleteWebsite}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ItemDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        item={selectedWebsite}
        onApprove={handleApprove}
        onReject={handleReject}
        deleteWebsite={deleteWebsite}
        onClose={() => setDetailsOpen(false)}
        t={t}
        i18n={i18n}
      />
    </DashboardLayout>
  );
}
