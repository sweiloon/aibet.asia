import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Globe2,
  KeyRound,
  Eye,
  FileText,
  File,
  Download,
  Trash2,
} from "lucide-react";
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

interface ApprovalsTableProps {
  items: Website[];
  onViewDetails: (item: Website) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  title?: string;
  showActions?: boolean;
  searchTerm?: string;
  onClearSearch?: () => void;
  deleteWebsite?: (id: string) => void;
}

export const ApprovalsTable = ({
  items,
  onViewDetails,
  onApprove,
  onReject,
  title,
  showActions = false,
  searchTerm,
  onClearSearch,
  deleteWebsite,
}: ApprovalsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const getItemIcon = (type: string) => {
    switch (type) {
      case "website":
        return <Globe2 className="h-4 w-4" />;
      case "id-card":
        return <File className="h-4 w-4" />;
      case "bank-statement":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <Globe2 className="h-4 w-4" />;
    }
  };

  const getItemTypeDisplay = (item: Website) => {
    if (item.url === "N/A" || !item.url) {
      return (
        <Badge variant="outline" className="capitalize">
          {item.type || "Document"}
        </Badge>
      );
    }
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-blue-400 hover:underline"
      >
        {getItemIcon(item.type || "website")}
        {item.url}
      </a>
    );
  };

  // Function to check if file is downloadable (PDF or image)
  const isDownloadable = (item: Website) => {
    return (
      item.files &&
      item.files.length > 0 &&
      (item.type === "id-card" ||
        item.type === "bank-statement" ||
        item.type === "document")
    );
  };

  // Function to handle download of files
  const handleDownload = (item: Website) => {
    if (!item.files || item.files.length === 0) return;

    // For each file in the item, create an anchor and trigger download
    item.files.forEach((file, index) => {
      // Check if file has a valid URL
      if (file.url) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = `${item.name}-file-${index + 1}${getFileExtension(
          file.url
        )}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  // Helper function to get file extension
  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    if (parts.length > 1) {
      return `.${parts[parts.length - 1]}`;
    }
    return "";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type/URL</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Date</TableHead>
          {showActions ? (
            <TableHead>Details</TableHead>
          ) : (
            <TableHead>{title || ""}</TableHead>
          )}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{getItemTypeDisplay(item)}</TableCell>
              <TableCell>{item.useremail || "Unknown User"}</TableCell>
              <TableCell>
                {new Date(item.createdat).toLocaleDateString()}
              </TableCell>
              {showActions ? (
                <TableCell>
                  {item.username || item.files ? (
                    <Badge className="flex items-center gap-1">
                      <KeyRound className="h-3 w-3" />
                      {item.files
                        ? `${item.files.length} Files`
                        : "Credentials"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
              ) : (
                <TableCell>
                  {title &&
                    new Date(
                      item.updatedat || item.createdat
                    ).toLocaleDateString()}
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  {deleteWebsite && (
                    <AlertDialog
                      open={deleteDialogOpen && pendingDeleteId === item.id}
                      onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setPendingDeleteId(null);
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setPendingDeleteId(item.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this submission?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                              if (deleteWebsite) deleteWebsite(item.id);
                              setDeleteDialogOpen(false);
                              setPendingDeleteId(null);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {showActions && onApprove && onReject && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-300"
                        title="Approve"
                        onClick={() => onApprove(item.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        title="Reject"
                        onClick={() => onReject(item.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              <p>No {title ? title.toLowerCase() : "items"} found</p>
              {searchTerm && onClearSearch && (
                <Button variant="link" onClick={onClearSearch} className="mt-2">
                  Clear search
                </Button>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
