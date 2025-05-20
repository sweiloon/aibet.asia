import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Website } from "@/context/WebsiteContext";
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
import { useState } from "react";
import { openInNewTab } from "@/lib/openInNewTab";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Website | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  deleteWebsite: (id: string) => void;
  onClose: () => void;
  t: TFunction;
  i18n: I18nInstanceType;
}

export const ItemDetailsDialog = ({
  open,
  onOpenChange,
  item,
  onApprove,
  onReject,
  deleteWebsite,
  onClose,
  t,
  i18n,
}: ItemDetailsDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  if (!item) return null;

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(item.id);
      onOpenChange(false);
    }
  };

  const handleRejectClick = () => {
    if (onReject) {
      onReject(item.id);
      onOpenChange(false);
    }
  };

  // Helper to translate item type, similar to ApprovalsTable
  const getTranslatedItemType = (type: Website["type"]) => {
    let itemTypeKey = type.charAt(0).toUpperCase() + type.slice(1);
    if ((type as string) === "id-card") itemTypeKey = "ID Card";
    if ((type as string) === "bank-statement") itemTypeKey = "Bank Statement";
    return t(itemTypeKey) || t("Document"); // Fallback to Document if specific type not found
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("Submission Details")}</DialogTitle>
          <DialogDescription>
            {t("Full details for the submission")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
                {getTranslatedItemType(item.type)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Submitted By")}
              </p>
              <p className="text-base">
                {item.useremail || t("Unknown User")}{" "}
              </p>{" "}
              {/* Display useremail */}
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
                href={item.url} // Assuming URL is already correctly formatted
                className="text-blue-400 hover:underline"
                tabIndex={0}
                role="link"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  openInNewTab(item.url);
                }}
              >
                {item.url}
              </a>
            </div>
          )}

          {/* Credentials Section: Only for website (URL) type submissions */}
          {(item.type === "website" ||
            item.type === "app" ||
            item.type === "other") &&
            (item.adminCredentials ||
              // @ts-expect-error: username/password may exist on legacy Website objects
              item.username ||
              // @ts-expect-error: username/password may exist on legacy Website objects
              item.password) && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("Credentials")}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("Username")}
                    </p>
                    <p className="text-base">
                      {item.adminCredentials
                        ? item.adminCredentials.username
                        : // @ts-expect-error: username may exist on legacy Website objects
                          item.username || t("Not provided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("Password")}
                    </p>
                    <p className="text-base">
                      {item.adminCredentials
                        ? item.adminCredentials.password
                        : // @ts-expect-error: password may exist on legacy Website objects
                          item.password || t("Not provided")}
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
                            {t("Download Image")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
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
          {/* Action buttons section: Approve, Reject, Delete */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <div>
              {item.status === "pending" && onApprove && onReject && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300"
                    onClick={handleApproveClick}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {t("Approve")}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                    onClick={handleRejectClick}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {t("Reject")}
                  </Button>
                </div>
              )}
            </div>

            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("Delete Submission")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "Are you sure you want to delete this submission? This action cannot be undone."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                    {t("Cancel")}
                  </AlertDialogCancel>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
