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
import { openInNewTab } from "@/lib/openInNewTab";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

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
  t: TFunction;
  i18n: I18nInstanceType;
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
  t,
  i18n,
}: ApprovalsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const getItemIcon = (type: string) => {
    switch (type as string) {
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
    let itemTypeKey =
      (item.type as string).charAt(0).toUpperCase() +
      (item.type as string).slice(1);
    if ((item.type as string) === "id-card") itemTypeKey = "ID Card";
    if ((item.type as string) === "bank-statement")
      itemTypeKey = "Bank Statement";

    if (item.url === "N/A" || !item.url) {
      return (
        <Badge variant="outline" className="capitalize">
          {t(itemTypeKey) || t("Document")}
        </Badge>
      );
    }
    return (
      <a
        href={item.url}
        className="flex items-center gap-1 text-blue-400 hover:underline"
        tabIndex={0}
        role="link"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          openInNewTab(item.url);
        }}
      >
        {getItemIcon(item.type as string)}
        {item.url}
      </a>
    );
  };

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    if (parts.length > 1) {
      return `.${parts[parts.length - 1]}`;
    }
    return "";
  };

  const defaultTitle = title || t("Submitted On");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Name")}</TableHead>
          <TableHead>{t("Type/URL")}</TableHead>
          <TableHead>{t("Submitted By")}</TableHead>
          <TableHead>{t("Date")}</TableHead>
          {showActions ? (
            <TableHead>{t("Details")}</TableHead>
          ) : (
            <TableHead>{defaultTitle}</TableHead>
          )}
          <TableHead className="text-right">{t("Actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{getItemTypeDisplay(item)}</TableCell>
              <TableCell>{item.useremail || t("Unknown User")}</TableCell>
              <TableCell>
                {new Date(item.createdat).toLocaleDateString()}
              </TableCell>
              {showActions ? (
                <TableCell>
                  {item.adminCredentials?.username ||
                  (item.files && item.files.length > 0) ? (
                    <Badge className="flex items-center gap-1">
                      <KeyRound className="h-3 w-3" />
                      {item.files && item.files.length > 0
                        ? t("{{count}} Files", { count: item.files.length })
                        : t("Credentials")}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {t("None")}
                    </span>
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
                    {t("Details")}
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
                              if (deleteWebsite) deleteWebsite(item.id);
                              setDeleteDialogOpen(false);
                              setPendingDeleteId(null);
                            }}
                          >
                            {t("Delete")}
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
                        title={t("Approve")}
                        onClick={() => onApprove(item.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {t("Approve")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        title={t("Reject")}
                        onClick={() => onReject(item.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {t("Reject")}
                      </Button>
                    </>
                  )}
                  {item.files &&
                    item.files.length > 0 &&
                    item.files.map((file, idx) =>
                      file.url ? (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
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
                        </Button>
                      ) : null
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              <p>
                {t("No {{items}} found", {
                  items: title
                    ? t(
                        title
                          .toLowerCase()
                          .replace(" on", "")
                          .replace("date ", "")
                      )
                    : t("items"),
                })}
              </p>
              {searchTerm && onClearSearch && (
                <Button variant="link" onClick={onClearSearch} className="mt-2">
                  {t("Clear search")}
                </Button>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
