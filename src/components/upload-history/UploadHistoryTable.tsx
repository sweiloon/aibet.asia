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
import { Eye, FileText, File, Trash2 } from "lucide-react";
import { Website } from "@/context/WebsiteContext";

interface UploadHistoryTableProps {
  uploads: Website[];
  onViewDetails: (item: Website) => void;
  title?: string;
  deleteWebsite?: (id: string) => void;
}

export const UploadHistoryTable = ({
  uploads,
  onViewDetails,
  title,
  deleteWebsite,
}: UploadHistoryTableProps) => {
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "website":
        return <Badge variant="outline">Website</Badge>;
      case "document":
        return <Badge variant="outline">Document</Badge>;
      case "id-card":
        return <Badge variant="outline">ID Card</Badge>;
      case "bank-statement":
        return <Badge variant="outline">Bank Statement</Badge>;
      default:
        return <Badge variant="outline">Website</Badge>;
    }
  };

  const getTypeIcon = (item: Website) => {
    if (
      item.type === "id-card" ||
      item.type === "bank-statement" ||
      item.type === "document"
    ) {
      return item.type === "bank-statement" ? (
        <FileText className="h-4 w-4 mr-1" />
      ) : (
        <File className="h-4 w-4 mr-1" />
      );
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>{title || "Submitted On"}</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {uploads.length > 0 ? (
          uploads.map((upload: Website) => (
            <TableRow key={upload.id}>
              <TableCell className="font-medium flex items-center">
                {getTypeIcon(upload)}
                {upload.name}
              </TableCell>
              <TableCell>{getTypeBadge(upload.type || "website")}</TableCell>
              <TableCell>{getStatusBadge(upload.status)}</TableCell>
              <TableCell>
                <p className="text-xs text-muted-foreground">
                  {upload.updatedat
                    ? new Date(upload.updatedat).toLocaleDateString()
                    : "-"}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(upload)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              <p>
                No{" "}
                {title
                  ? title.toLowerCase().replace(" on", "")
                  : "upload history"}{" "}
                found
              </p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
