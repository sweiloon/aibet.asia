
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Website } from "@/context/WebsiteContext";

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Website | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ItemDetailsDialog = ({ 
  open, 
  onOpenChange, 
  item,
  onApprove,
  onReject
}: ItemDetailsDialogProps) => {
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
          <DialogDescription>
            Full details for the submission
          </DialogDescription>
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
              <p className="text-sm font-medium text-muted-foreground">Submitted By</p>
              <p className="text-base">{item.userId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
              <p className="text-base">{new Date(item.createdAt).toLocaleDateString()}</p>
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
              <p className="text-sm font-medium text-muted-foreground mb-2">Login Credentials</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p className="text-base">{item.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Password</p>
                  <p className="text-base">{item.password}</p>
                </div>
              </div>
            </div>
          )}
          
          {item.files && item.files.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Files</p>
              <div className="grid grid-cols-2 gap-4">
                {item.files.map((file: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    {file.type.includes("image") ? (
                      <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="p-2 bg-muted rounded">PDF</div>
                    )}
                    <div className="text-sm truncate">{file.name}</div>
                  </div>
                ))}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
