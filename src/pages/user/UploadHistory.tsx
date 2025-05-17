import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWebsites } from "@/context/WebsiteContext";
import { UploadHistoryTable } from "@/components/upload-history/UploadHistoryTable";
import { UploadDetailsDialog } from "@/components/upload-history/UploadDetailsDialog";
import { Website } from "@/context/WebsiteContext";
import { useTranslation } from "react-i18next";

export default function UploadHistory() {
  const { t, i18n } = useTranslation();
  const { getUserWebsites, deleteWebsite } = useWebsites();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Website | null>(null);
  const [pendingDownloadFile, setPendingDownloadFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const userUploads = getUserWebsites();

  // Filter uploads by status
  const approvedUploads = userUploads.filter(
    (item) => item.status === "approved"
  );
  const pendingUploads = userUploads.filter(
    (item) => item.status === "pending"
  );
  const rejectedUploads = userUploads.filter(
    (item) => item.status === "rejected"
  );

  const viewDetails = (item: Website) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  // Download handler to pass to dialog
  const handleDownload = (file: { url: string; name: string }) => {
    setPendingDownloadFile(file);
    setDetailsOpen(false);
  };

  useEffect(() => {
    if (pendingDownloadFile && !detailsOpen) {
      if (pendingDownloadFile.url && pendingDownloadFile.name) {
        window.dispatchEvent(
          new CustomEvent("trigger-download", {
            detail: {
              url: `/api/download?url=${encodeURIComponent(
                pendingDownloadFile.url
              )}&name=${encodeURIComponent(pendingDownloadFile.name)}`,
            },
          })
        );
      }
      setPendingDownloadFile(null);
    }
  }, [pendingDownloadFile, detailsOpen]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Upload History")}</h1>
          <p className="text-muted-foreground">
            {t("View all your previous upload submissions")}
          </p>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <span>{t("All")}</span>
              <Badge variant="outline">{userUploads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <span>{t("Approved")}</span>
              <Badge variant="outline">{approvedUploads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <span>{t("Pending")}</span>
              <Badge variant="outline">{pendingUploads.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <span>{t("Rejected")}</span>
              <Badge variant="outline">{rejectedUploads.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* All uploads tab content */}
          <TabsContent value="all">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable
                  uploads={userUploads}
                  onViewDetails={viewDetails}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved tab content */}
          <TabsContent value="approved">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable
                  uploads={approvedUploads}
                  onViewDetails={viewDetails}
                  title={t("Approved On")}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending tab content */}
          <TabsContent value="pending">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable
                  uploads={pendingUploads}
                  onViewDetails={viewDetails}
                  title={t("Submitted On")}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rejected tab content */}
          <TabsContent value="rejected">
            <Card className="glass-morphism">
              <CardContent className="p-0">
                <UploadHistoryTable
                  uploads={rejectedUploads}
                  onViewDetails={viewDetails}
                  title={t("Rejected On")}
                  t={t}
                  i18n={i18n}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedItem &&
          Array.isArray(selectedItem.files) &&
          selectedItem.files.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-semibold mb-2">
                {t("Download Files")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {selectedItem.files.map((file, index) =>
                  file.url ? (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2"
                    >
                      {file.type && file.type.includes("image") ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-32 h-32 object-contain rounded border"
                        />
                      ) : null}
                      <span className="text-xs text-muted-foreground">
                        {file.name} ({file.type})
                      </span>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = `/api/download?url=${encodeURIComponent(
                            file.url
                          )}&name=${encodeURIComponent(file.name)}`;
                          a.download = file.name;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                      >
                        {t("Download")}
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
      </div>

      <UploadDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        item={selectedItem}
        onClose={() => setDetailsOpen(false)}
        onDownload={handleDownload}
        deleteWebsite={deleteWebsite}
        t={t}
        i18n={i18n}
      />
    </DashboardLayout>
  );
}
