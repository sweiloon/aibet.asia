import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Website, WebsiteTask } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { FileUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

interface ManagementRecordsProps {
  approvedWebsites: Website[];
}

// Helper function to get translated task status
const getTranslatedTaskStatus = (taskCompleted: boolean, t: TFunction) => {
  if (taskCompleted) return t("Completed");
  return t("Pending"); // Default to Pending if not completed
};

export function ManagementRecords({
  approvedWebsites,
}: ManagementRecordsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("Recent Management Records")}</h2>

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
                        const dateA = a.start_date;
                        const dateB = b.start_date;
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
                                  {t("Date:")}
                                  {new Date(
                                    record.start_date
                                  ).toLocaleDateString()}
                                </strong>
                              </div>
                              <div className="space-y-2">
                                {(record.tasks as WebsiteTask[]).map(
                                  (task, index) => (
                                    <div
                                      key={task.id || index}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <div>
                                        <span className="font-semibold">
                                          {task.label}:
                                        </span>{" "}
                                      </div>
                                      <div>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs ${
                                            task.completed
                                              ? "bg-green-500/20 text-green-300"
                                              : "bg-blue-500/20 text-blue-300"
                                          }`}
                                        >
                                          {getTranslatedTaskStatus(
                                            task.completed,
                                            t
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        } else {
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
                                  : t("Invalid Date")}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <b>{t("Day:")}</b> {record.day ?? "-"}
                                </div>
                                <div>
                                  <b>{t("Credit:")}</b> {record.credit ?? "-"}
                                </div>
                                <div>
                                  <b>{t("Profit:")}</b> {record.profit ?? "-"}
                                </div>
                                <div>
                                  <b>{t("Gross Profit:")}</b>{" "}
                                  {record.gross_profit ?? "-"}
                                </div>
                                <div>
                                  <b>{t("Service Fee:")}</b>{" "}
                                  {record.service_fee ?? "-"}
                                </div>
                                <div>
                                  <b>{t("Start Date:")}</b>{" "}
                                  {record.start_date
                                    ? new Date(
                                        record.start_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </div>
                                <div>
                                  <b>{t("End Date:")}</b>{" "}
                                  {record.end_date
                                    ? new Date(
                                        record.end_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </div>
                                <div>
                                  <b>{t("Net Profit:")}</b>{" "}
                                  {record.net_profit ?? "-"}
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
                      {t("View All Records")}
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
                  <p>{t("No management records available yet.")}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t(
                      "Management records will appear once our team starts working on your websites."
                    )}
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
              <p className="text-xl">{t("No approved websites yet")}</p>
              <p className="text-muted-foreground mt-2">
                {t(
                  "Submit your websites for approval to see management records here."
                )}
              </p>
              <Button
                onClick={() => navigate("/dashboard/websites/add")}
                className="mt-4"
              >
                <FileUp className="mr-2 h-4 w-4" />
                {t("Upload Website")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
