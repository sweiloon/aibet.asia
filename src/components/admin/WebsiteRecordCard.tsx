import { useState } from "react";
import { Website, WebsiteManagement } from "@/context/WebsiteContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Plus, Mail } from "lucide-react";
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

interface WebsiteRecordCardProps {
  website: Website;
  onAddRecord: (website: Website) => void;
  onDeleteRecord: (websiteId: string, recordId: string) => void;
  onClearRecords: (websiteId: string) => void;
  onEditField: (
    websiteId: string,
    recordId: string,
    field: string,
    value: any
  ) => void;
}

export const WebsiteRecordCard = ({
  website,
  onAddRecord,
  onDeleteRecord,
  onClearRecords,
  onEditField,
}: WebsiteRecordCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    recordId: string;
    field: string;
    value: any;
    fieldType?: string;
  } | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const handleEditField = (recordId: string, field: string, value: any) => {
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
            <span>Clear Records</span>
          </Button>
          <Button
            onClick={() => onAddRecord(website)}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Day</span>
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {website.url}
        </a>
      </div>

      {website.managementData.length === 0 ? (
        <div className="text-center p-6 border rounded-lg">
          <p className="text-muted-foreground">No management records yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Gross Profit</TableHead>
              <TableHead>Service Fee</TableHead>
              <TableHead>Net Profit</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {website.managementData.map((record) => (
              <TableRow key={record.id}>
                <TableCell
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => handleEditField(record.id, "day", record.day)}
                >
                  {record.day}
                </TableCell>
                <TableCell
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() =>
                    handleEditField(record.id, "credit", record.credit)
                  }
                >
                  {record.credit}
                </TableCell>
                <TableCell
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() =>
                    handleEditField(record.id, "profit", record.profit)
                  }
                >
                  {record.profit}
                </TableCell>
                <TableCell
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() =>
                    handleEditField(
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
                    handleEditField(
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
                    handleEditField(record.id, "net_profit", record.net_profit)
                  }
                >
                  {record.net_profit}
                </TableCell>
                <TableCell
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() =>
                    handleEditField(record.id, "start_date", record.start_date)
                  }
                >
                  {record.start_date
                    ? new Date(record.start_date).toISOString().split("T")[0]
                    : ""}
                </TableCell>
                <TableCell
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() =>
                    handleEditField(record.id, "end_date", record.end_date)
                  }
                >
                  {record.end_date
                    ? new Date(record.end_date).toISOString().split("T")[0]
                    : ""}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDetailOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Record</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this record? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteRecord(website.id, record.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
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

      {/* Dialogs */}
      <WebsiteDetailsDialog
        website={website}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {editingRecord && (
        <EditFieldDialog
          field={editingRecord.field}
          initialValue={editingRecord.value}
          fieldType={editingRecord.fieldType as "text" | "number" | "date"}
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all records</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all records for this website? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearRecordsConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All Records
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
