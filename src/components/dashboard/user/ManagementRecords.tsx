import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Website } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { FileUp } from "lucide-react";

interface ManagementRecordsProps {
  approvedWebsites: Website[];
}

export function ManagementRecords({
  approvedWebsites,
}: ManagementRecordsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Management Records</h2>

      {approvedWebsites.length > 0 ? (
        <div className="space-y-4">
          {approvedWebsites
            .filter((site) => site.managementData.length > 0)
            .map((site) => (
              <Card key={site.id} className="glass-morphism overflow-hidden">
                <CardHeader>
                  <CardTitle>{site.name}</CardTitle>
                  <CardDescription>{site.url}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {site.managementData
                      .sort((a, b) => {
                        const dateA = a.date || a.start_date;
                        const dateB = b.date || b.start_date;
                        return (
                          new Date(dateB).getTime() - new Date(dateA).getTime()
                        );
                      })
                      .slice(0, 2)
                      .map((record) => {
                        if (record.tasks && record.tasks.length > 0) {
                          return (
                            <div
                              key={record.id}
                              className="border border-border p-4 rounded-md"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <strong>
                                  Date:{" "}
                                  {new Date(
                                    record.date || record.start_date
                                  ).toLocaleDateString()}
                                </strong>
                              </div>
                              <div className="space-y-2">
                                {record.tasks.map((task, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div>
                                      <span className="font-semibold">
                                        {task.type}:
                                      </span>{" "}
                                      {task.description}
                                    </div>
                                    <div>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          task.status === "completed"
                                            ? "bg-green-500/20 text-green-300"
                                            : task.status === "in-progress"
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : "bg-blue-500/20 text-blue-300"
                                        }`}
                                      >
                                        {task.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          // For the new management record format
                          return (
                            <div
                              key={record.id}
                              className="border border-border p-4 rounded-md"
                            >
                              <div className="font-medium text-lg mb-3">
                                {record.start_date
                                  ? new Date(
                                      record.start_date
                                    ).toLocaleDateString()
                                  : "Invalid Date"}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <b>Day:</b> {record.day ?? "-"}
                                </div>
                                <div>
                                  <b>Credit:</b> {record.credit ?? "-"}
                                </div>
                                <div>
                                  <b>Profit:</b> {record.profit ?? "-"}
                                </div>
                                <div>
                                  <b>Gross Profit:</b>{" "}
                                  {record.gross_profit ?? "-"}
                                </div>
                                <div>
                                  <b>Service Fee:</b>{" "}
                                  {record.service_fee ?? "-"}
                                </div>
                                <div>
                                  <b>Start Date:</b>{" "}
                                  {record.start_date
                                    ? new Date(
                                        record.start_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </div>
                                <div>
                                  <b>End Date:</b>{" "}
                                  {record.end_date
                                    ? new Date(
                                        record.end_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </div>
                                <div>
                                  <b>Net Profit:</b> {record.net_profit ?? "-"}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/dashboard/websites/${site.id}`)}
                    >
                      View All Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {approvedWebsites.filter((site) => site.managementData.length > 0)
            .length === 0 && (
            <Card className="glass-morphism">
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p>No management records available yet.</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Management records will appear once our team starts working
                    on your websites.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="glass-morphism">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-xl">No approved websites yet</p>
              <p className="text-muted-foreground mt-2">
                Submit your websites for approval to see management records
                here.
              </p>
              <Button
                onClick={() => navigate("/dashboard/websites/add")}
                className="mt-4"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Upload Website
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
