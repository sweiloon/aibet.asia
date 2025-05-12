
import { useState } from "react";
import { Website, WebsiteManagement } from "@/context/WebsiteContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ManagementRecordDialog } from "./ManagementRecordDialog";

interface ManagementTabContentProps {
  website: Website;
  onEditRecord: (record: WebsiteManagement) => void;
  onDeleteRecord: (recordId: string) => void;
  onAddRecord: () => void;
}

export function ManagementTabContent({
  website,
  onEditRecord,
  onDeleteRecord,
  onAddRecord
}: ManagementTabContentProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Management Records</h2>
        <Button onClick={onAddRecord}>
          Add New Record
        </Button>
      </div>
      
      {website.managementData.length > 0 ? (
        <Card className="glass-morphism">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...website.managementData]
                  .sort((a, b) => {
                    const dateA = a.date || a.startDate;
                    const dateB = b.date || b.startDate;
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                  })
                  .map(record => {
                    let completedCount = 0;
                    let totalTasks = 0;
                    
                    if (record.tasks && record.tasks.length > 0) {
                      totalTasks = record.tasks.length;
                      completedCount = record.tasks.filter(
                        task => task.status === "completed"
                      ).length;
                    }
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {new Date(record.date || record.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.tasks ? record.tasks.length : 0} tasks</TableCell>
                        <TableCell>
                          {record.tasks ? `${completedCount}/${totalTasks}` : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditRecord(record)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDeleteRecord(record.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-morphism">
          <CardContent className="py-10">
            <div className="text-center">
              <p>No management records yet</p>
              <Button
                onClick={onAddRecord}
                className="mt-4"
              >
                Add First Record
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
