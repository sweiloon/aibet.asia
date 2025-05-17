import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Website } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface UploadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Website | null;
  deleteWebsite: (id: string) => void;
  onClose: () => void;
  onDownload: (file: { name: string; url: string }) => void;
  t: TFunction;
  i18n: I18nInstanceType;
}

export const UploadDetailsDialog = ({
  open,
  onOpenChange,
  item,
  deleteWebsite,
  onClose,
  onDownload,
  t,
  i18n,
}: UploadDetailsDialogProps) => {
  const navigate = useNavigate();
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!item) return null;

  const getStatusBadge = (status: string) => {
    const statusKey = status.charAt(0).toUpperCase() + status.slice(1);
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
            {t(statusKey)}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
            {t(statusKey)}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
            {t(statusKey)}
          </Badge>
        );
      default:
        return <Badge>{t(statusKey)}</Badge>; // Fallback
    }
  };

  const handleResubmit = () => {
    onOpenChange(false);
    if ((item.type as string) === "website") {
      // Cast for comparison
      navigate("/dashboard/websites/add");
    } else if (
      (item.type as string) === "id-card" ||
      (item.type as string) === "bank-statement"
    ) {
      // Cast for comparison
      navigate("/dashboard/upload-document");
    }
  };

  const handleDialogDownload = (file) => {
    if (onOpenChange) onOpenChange(false);
    if (!file.url) return;
    const a = document.createElement("a");
    a.href = `/api/download?url=${encodeURIComponent(
      file.url
    )}&name=${encodeURIComponent(file.name)}`;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <a ref={downloadLinkRef} style={{ display: "none" }} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("Submission Details")}</DialogTitle>
            <DialogDescription>
              {t("Details for your submitted item")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {t("Submission Details")}
              </h2>
              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("Delete Submission")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t(
                        "Are you sure you want to delete this submission? This action cannot be undone."
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        if (item) deleteWebsite(item.id);
                        setDeleteDialogOpen(false);
                        onClose();
                      }}
                    >
                      {t("Delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("Name")}
                </p>
                <p className="text-base">{item.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("Type")}
                </p>
                <p className="text-base capitalize">
                  {t(
                    item.type
                      ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                      : "Website"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("Status")}
                </p>
                <div className="mt-1">{getStatusBadge(item.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("Date Submitted")}
                </p>
                <p className="text-base">
                  {new Date(item.createdat).toLocaleDateString()}
                </p>
              </div>
            </div>

            {item.url && item.url !== "N/A" && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("URL")}
                </p>
                <a
                  href={
                    item.url.startsWith("http")
                      ? item.url
                      : `https://${item.url}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {item.url}
                </a>
              </div>
            )}

            {item.adminCredentials && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("Login Credentials")}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("Username")}
                    </p>
                    <p className="text-base">
                      {item.adminCredentials.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("Password")}
                    </p>
                    {/* Consider hiding/masking password or showing a generic message */}
                    <p className="text-base">
                      {item.adminCredentials.password}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {Array.isArray(item.files) && item.files.length > 0 ? (
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("Files")}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {item.files.map((file, index) =>
                    file.url ? (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2"
                      >
                        {file.type && file.type.includes("image") ? (
                          <>
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-32 h-32 object-contain rounded border"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => handleDialogDownload(file)}
                            >
                              {t("Download Image")}
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleDialogDownload(file)}
                          >
                            {t("Download File")}
                          </Button>
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("Files")}
                </p>
                <div className="text-xs text-muted-foreground">
                  {t(
                    "No files available or files are not in the correct format."
                  )}
                </div>
              </div>
            )}

            {item.status === "rejected" && item.rejectionReason && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("Rejection Reason")}
                </p>
                <p className="text-base text-red-400">{item.rejectionReason}</p>
              </div>
            )}

            {item.status === "rejected" && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleResubmit}>{t("Resubmit")}</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
