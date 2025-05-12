
import { useState } from "react";
import { Website, WebsiteManagement } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecentManagementCardProps {
  website: Website;
  onEditRecord: (record: WebsiteManagement) => void;
  onDeleteRecord: (recordId: string) => void;
  onAddRecord: () => void;
  onViewAllRecords: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export function RecentManagementCard({
  website,
  onEditRecord,
  onDeleteRecord,
  onAddRecord,
  onViewAllRecords,
  getStatusBadge
}: RecentManagementCardProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Recent Management Activities</CardTitle>
        <CardDescription>Latest records for this website</CardDescription>
      </CardHeader>
      <CardContent>
        {website.managementData.length > 0 ? (
          <div className="space-y-4">
            {[...website.managementData]
              .sort((a, b) => {
                const dateA = a.date || a.startDate;
                const dateB = b.date || b.startDate;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              })
              .slice(0, 3)
              .map(record => (
                <div key={record.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {new Date(record.date || record.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
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
                  </div>
                  
                  {record.tasks && record.tasks.length > 0 && (
                    <div className="space-y-2">
                      {record.tasks.map((task, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <div>
                            <span className="font-semibold">{task.type}:</span> {task.description}
                          </div>
                          <div>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
            {website.managementData.length > 3 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onViewAllRecords}
              >
                View All Records
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p>No management records yet</p>
            <Button
              onClick={onAddRecord}
              className="mt-4"
            >
              Add First Record
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
