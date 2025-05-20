import { useState } from "react";
import {
  Website,
  WebsiteManagement,
  WebsiteTask,
} from "@/context/WebsiteContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, Plus, Mail, Edit } from "lucide-react";
import { WebsiteDetailsDialog } from "./WebsiteDetailsDialog";
import { EditFieldDialog } from "./EditFieldDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { openInNewTab } from "@/lib/openInNewTab";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecordForm } from "@/components/admin/RecordForm";

interface WebsiteRecordCardProps {
  website: Website;
  onAddRecord: (website: Website) => void;
  onDeleteRecord: (websiteId: string, recordId: string) => void;
  onClearRecords: (websiteId: string) => void;
  onEditField: (
    websiteId: string,
    recordId: string,
    field: string,
    value: string | number | WebsiteTask[]
  ) => void;
  t: TFunction;
  i18n: I18nInstanceType;
}

export const WebsiteRecordCard = ({
  website,
  onAddRecord,
  onDeleteRecord,
  onClearRecords,
  onEditField,
  t,
  i18n,
}: WebsiteRecordCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    recordId: string;
    field: string;
    value: string | number | WebsiteTask[];
    fieldType?: string;
  } | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<WebsiteManagement | null>(null);

  const handleEditFieldClick = (
    recordId: string,
    field: string,
    value: string | number | WebsiteTask[]
  ) => {
    const fieldType = getFieldType(field);
    setEditingRecord({ recordId, field, value, fieldType });
  };

  const getFieldType = (field: string): "text" | "number" | "date" => {
    if (field === "start_date" || field === "end_date") return "date";
    if (
      [
        "credit",
        "profit",
        "gross_profit",
        "service_fee",
        "net_profit",
      ].includes(field)
    )
      return "number";
    return "text";
  };

  const handleSaveEdit = (value: string | number) => {
    if (!editingRecord) return;
    onEditField(website.id, editingRecord.recordId, editingRecord.field, value);
    setEditingRecord(null);
  };

  const handleClearRecordsConfirm = () => {
    onClearRecords(website.id);
    setIsClearDialogOpen(false);
  };

  const tableHeaders = [
    { key: "Day", label: t("Day") },
    { key: "Credit", label: t("Credit") },
    { key: "Profit", label: t("Profit") },
    { key: "Gross Profit", label: t("Gross Profit") },
    { key: "Service Fee", label: t("Service Fee") },
    { key: "Net Profit", label: t("Net Profit") },
    { key: "Start Date", label: t("Start Date") },
    { key: "End Date", label: t("End Date") },
  ];

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{website.name}</h2>
          {website.useremail && (
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Mail className="h-4 w-4 mr-1" />
              <span>{website.useremail}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsClearDialogOpen(true)}
            variant="destructive"
            size="sm"
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t("Clear Records")}</span>
          </Button>
          <Button
            onClick={() => setIsDetailOpen(true)}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            <span>{t("View Detail")}</span>
          </Button>
          <Button
            onClick={() => onAddRecord(website)}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>{t("Add Day")}</span>
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <a
          href={website.url}
          className="underline"
          tabIndex={0}
          role="link"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            openInNewTab(website.url);
          }}
        >
          {website.url}
        </a>
      </div>

      {website.managementData.length === 0 ? (
        <div className="text-center p-6 border rounded-lg">
          <p className="text-muted-foreground">
            {t("No management records yet")}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHead key={header.key}>{header.label}</TableHead>
              ))}
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...website.managementData]
              .sort((a: WebsiteManagement, b: WebsiteManagement) => {
                const dayA = Number(a.day) || 0;
                const dayB = Number(b.day) || 0;
                return dayB - dayA;
              })
              .map((record: WebsiteManagement) => (
                <TableRow key={record.id}>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(record.id, "day", record.day)
                    }
                  >
                    {record.day}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(record.id, "credit", record.credit)
                    }
                  >
                    {record.credit}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(record.id, "profit", record.profit)
                    }
                  >
                    {record.profit}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(
                        record.id,
                        "gross_profit",
                        record.gross_profit
                      )
                    }
                  >
                    {record.gross_profit}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(
                        record.id,
                        "service_fee",
                        record.service_fee
                      )
                    }
                  >
                    {record.service_fee}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(
                        record.id,
                        "net_profit",
                        record.net_profit
                      )
                    }
                  >
                    {record.net_profit}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(
                        record.id,
                        "start_date",
                        record.start_date
                      )
                    }
                  >
                    {record.start_date
                      ? new Date(record.start_date).toISOString().split("T")[0]
                      : "-"}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() =>
                      handleEditFieldClick(
                        record.id,
                        "end_date",
                        record.end_date
                      )
                    }
                  >
                    {record.end_date
                      ? new Date(record.end_date).toISOString().split("T")[0]
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditRecord(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("Delete Record")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t(
                              "Are you sure you want to delete this record? This action cannot be undone."
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              /* Handle cancel if needed */
                            }}
                          >
                            {t("Cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              onDeleteRecord(website.id, record.id)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t("Delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      <WebsiteDetailsDialog
        website={website}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        t={t}
        i18n={i18n}
      />

      {editingRecord &&
        (typeof editingRecord.value === "string" ||
          typeof editingRecord.value === "number") && (
          <EditFieldDialog
            field={editingRecord.field}
            initialValue={editingRecord.value}
            fieldType={editingRecord.fieldType as "text" | "number" | "date"}
            isOpen={!!editingRecord}
            onClose={() => setEditingRecord(null)}
            onSave={handleSaveEdit}
            t={t}
            i18n={i18n}
          />
        )}

      {editRecord && (
        <Dialog
          open={!!editRecord}
          onOpenChange={(open) => !open && setEditRecord(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("Edit Management Record")}</DialogTitle>
            </DialogHeader>
            <RecordForm
              initialValues={editRecord}
              onCancel={() => setEditRecord(null)}
              onSave={(updated) => {
                onEditField(website.id, editRecord.id, "day", updated.day);
                onEditField(
                  website.id,
                  editRecord.id,
                  "credit",
                  updated.credit
                );
                onEditField(
                  website.id,
                  editRecord.id,
                  "profit",
                  updated.profit
                );
                onEditField(
                  website.id,
                  editRecord.id,
                  "gross_profit",
                  updated.gross_profit
                );
                onEditField(
                  website.id,
                  editRecord.id,
                  "service_fee",
                  updated.service_fee
                );
                onEditField(
                  website.id,
                  editRecord.id,
                  "net_profit",
                  updated.net_profit
                );
                onEditField(
                  website.id,
                  editRecord.id,
                  "start_date",
                  updated.start_date
                );
                onEditField(
                  website.id,
                  editRecord.id,
                  "end_date",
                  updated.end_date
                );
                setEditRecord(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Clear all records")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "Are you sure you want to clear all records for this website? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsClearDialogOpen(false)}>
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearRecordsConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("Delete All Records")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
