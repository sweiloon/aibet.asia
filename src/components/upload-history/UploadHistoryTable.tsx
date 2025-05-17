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
import { Eye, FileText, File } from "lucide-react";
import { Website } from "@/context/WebsiteContext";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface UploadHistoryTableProps {
  uploads: Website[];
  onViewDetails: (item: Website) => void;
  title?: string;
  deleteWebsite?: (id: string) => void;
  t: TFunction;
  i18n: I18nInstanceType;
}

export const UploadHistoryTable = ({
  uploads,
  onViewDetails,
  title,
  deleteWebsite,
  t,
  i18n,
}: UploadHistoryTableProps) => {
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
        return <Badge>{t(statusKey)}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    let typeKey = "Website";
    if (type === "document") typeKey = "Document";
    else if (type === "id-card") typeKey = "ID Card";
    else if (type === "bank-statement") typeKey = "Bank Statement";
    return <Badge variant="outline">{t(typeKey)}</Badge>;
  };

  const getTypeIcon = (item: Website) => {
    if (
      (item.type as string) === "id-card" ||
      (item.type as string) === "bank-statement" ||
      (item.type as string) === "document"
    ) {
      return (item.type as string) === "bank-statement" ? (
        <FileText className="h-4 w-4 mr-1" />
      ) : (
        <File className="h-4 w-4 mr-1" />
      );
    }
    return null;
  };

  const defaultTitle = title || t("Submitted On");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Name")}</TableHead>
          <TableHead>{t("Type")}</TableHead>
          <TableHead>{t("Status")}</TableHead>
          <TableHead>{defaultTitle}</TableHead>
          <TableHead className="text-right">{t("Actions")}</TableHead>
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
                    {t("Details")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              <p>
                {t("No {{type}} found", {
                  type: title
                    ? t(title.toLowerCase().replace(" on", ""))
                    : t("upload history"),
                })}
              </p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
