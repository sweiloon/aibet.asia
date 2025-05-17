import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  useWebsites,
  Website,
  WebsiteManagement,
} from "@/context/WebsiteContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { WebsiteRecordCard } from "@/components/admin/WebsiteRecordCard";
import { RecordForm } from "@/components/admin/RecordForm";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WebsiteRecords = () => {
  const { t, i18n } = useTranslation();
  const {
    websites,
    addManagementRecord,
    updateManagementRecord,
    deleteManagementRecord,
    clearAllManagementRecords,
  } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // Get websiteId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const websiteIdFromQuery = queryParams.get("websiteId");

  // Only approved websites of type "website"
  let approvedWebsites = websites.filter(
    (website) => website.status === "approved" && website.type === "website"
  );

  // If websiteId is in query, filter for that specific website
  if (websiteIdFromQuery) {
    approvedWebsites = approvedWebsites.filter(
      (website) => website.id === websiteIdFromQuery
    );
  }

  // Apply search
  const filteredWebsites = approvedWebsites.filter((website) => {
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();

    return (
      website.name.toLowerCase().includes(searchTermLower) ||
      (website.useremail &&
        website.useremail.toLowerCase().includes(searchTermLower))
    );
  });

  // Handle add record dialog
  const prepareAddDialog = (website: Website) => {
    setSelectedWebsite(website);
    setIsAddDialogOpen(true);
  };

  // Handle add record
  const handleAddRecord = (
    formValues: Omit<WebsiteManagement, "id" | "website_id">
  ) => {
    if (!selectedWebsite) return;

    addManagementRecord(selectedWebsite.id, formValues);

    setIsAddDialogOpen(false);
    setSelectedWebsite(null);
    toast.success(t("Record added successfully"));
  };

  // Handle edit field
  const handleEditField = (
    websiteId: string,
    recordId: string,
    field: string,
    value:
      | string
      | number
      | Array<{ type: string; description: string; status: string }>
  ) => {
    updateManagementRecord(websiteId, recordId, { [field]: value });
    toast.success(t("{{field}} updated successfully", { field: t(field) }));
  };

  // Handle delete record
  const handleDeleteRecord = (websiteId: string, recordId: string) => {
    deleteManagementRecord(websiteId, recordId);
    toast.success(t("Record deleted successfully"));
  };

  // Handle clear all records for a website
  const handleClearAllRecords = (websiteId: string) => {
    const website = websites.find((w) => w.id === websiteId);
    if (
      !website ||
      !website.managementData ||
      website.managementData.length === 0
    ) {
      toast.info(t("There are no records to clear for this website."));
      return;
    }
    clearAllManagementRecords(websiteId);
    toast.success(t("All records cleared successfully"));
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{t("Website Records")}</h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search by website name or user email...")}
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
                ? t("No approved websites found")
                : t("No websites found matching your search")}
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
                t={t}
                i18n={i18n}
              />
            ))}
          </div>
        )}

        {/* Add Record Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Add Management Record")}</DialogTitle>
            </DialogHeader>
            <RecordForm
              onSave={handleAddRecord}
              onCancel={() => setIsAddDialogOpen(false)}
              initialValues={
                selectedWebsite
                  ? {
                      day: (() => {
                        const days = selectedWebsite.managementData.map(
                          (r) => Number(r.day) || 0
                        );
                        const maxDay = days.length > 0 ? Math.max(...days) : 0;
                        return String(maxDay + 1);
                      })(),
                    }
                  : {}
              }
              t={t}
              i18n={i18n}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteRecords;
