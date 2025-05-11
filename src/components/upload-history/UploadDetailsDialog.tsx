
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

interface UploadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Website | null;
}

export const UploadDetailsDialog = ({ open, onOpenChange, item }: UploadDetailsDialogProps) => {
  const navigate = useNavigate();

  if (!item) return null;

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

  const handleResubmit = () => {
    onOpenChange(false);
    
    // Navigate to appropriate upload page based on type
    if (item.type === "website") {
      navigate("/dashboard/websites/add");
    } else if (item.type === "id-card" || item.type === "bank-statement") {
      navigate("/dashboard/upload-document");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Details for your submitted item
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
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">{getStatusBadge(item.status)}</div>
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
                href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
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
          
          {item.status === "rejected" && item.rejectionReason && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
              <p className="text-base text-red-400">{item.rejectionReason}</p>
            </div>
          )}
          
          {item.status === "rejected" && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleResubmit}>
                Resubmit
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
