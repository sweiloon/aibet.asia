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

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Website | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  deleteWebsite: (id: string) => void;
  onClose: () => void;
}

export const ItemDetailsDialog = ({
  open,
  onOpenChange,
  item,
  onApprove,
  onReject,
  deleteWebsite,
  onClose,
}: ItemDetailsDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  if (!item) return null;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(item.id);
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(item.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>Full details for the submission</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{item.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-base capitalize">{item.type || "Website"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Submitted By
              </p>
              <p className="text-base">{item.userid}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date Submitted
              </p>
              <p className="text-base">
                {new Date(item.createdat).toLocaleDateString()}
              </p>
            </div>
          </div>

          {item.url && item.url !== "N/A" && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">URL</p>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                {item.url}
              </a>
            </div>
          )}

          {item.username && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Login Credentials
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p className="text-base">{item.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Password
                  </p>
                  <p className="text-base">{item.password}</p>
                </div>
              </div>
            </div>
          )}

          {Array.isArray(item.files) && item.files.length > 0 ? (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Files
              </p>
              <div className="grid grid-cols-2 gap-4">
                {item.files.map(
                  (
                    file: { name: string; url: string; type: string },
                    index: number
                  ) => (
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
                            asChild
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                          >
                            <a
                              href={file.url}
                              download={file.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download Image
                            </a>
                          </Button>
                        </>
                      ) : file.type && file.type.includes("pdf") ? (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <a
                            href={file.url}
                            download={file.name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download PDF
                          </a>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <a
                            href={file.url}
                            download={file.name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download File
                          </a>
                        </Button>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Files
              </p>
              <div className="text-xs text-muted-foreground">
                No files available or files are not in the correct format.
              </div>
            </div>
          )}

          {item.status === "pending" && onApprove && onReject && (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300"
                onClick={handleApprove}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                onClick={handleReject}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Submission Details</h2>
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
                  <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this submission? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      if (item) deleteWebsite(item.id);
                      setDeleteDialogOpen(false);
                      onClose();
                    }}
                  >
                    Delete
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
