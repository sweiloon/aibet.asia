import { Website } from "@/context/WebsiteContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RecentManagementCardProps {
  websitesWithRecords: Website[];
}

export const RecentManagementCard = ({
  websitesWithRecords,
}: RecentManagementCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-300" />
          {t("Recent Management Records")}
        </CardTitle>
        <CardDescription>
          {t("Latest website management activities")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {websitesWithRecords.length > 0 ? (
          <div className="space-y-4">
            {websitesWithRecords.map((website) => {
              const latestRecord = [...website.managementData].sort((a, b) => {
                const dateA = a.start_date;
                const dateB = b.start_date;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              })[0];

              let completedTasks = 0;
              let totalTasks = 0;

              if (latestRecord.tasks && latestRecord.tasks.length > 0) {
                totalTasks = latestRecord.tasks.length;
                completedTasks = latestRecord.tasks.filter(
                  (task) => task.completed === true
                ).length;
              }

              return (
                <div
                  key={website.id}
                  className="p-3 border border-border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{website.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("Updated on")}{" "}
                        {new Date(latestRecord.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/websites/${website.id}`)}
                    >
                      {t("Details")}
                    </Button>
                  </div>
                  {latestRecord.tasks && latestRecord.tasks.length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-green-300">{completedTasks}</span>
                      <span className="text-muted-foreground">
                        {t("tasks_completed_status", {
                          totalTasks: totalTasks,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate("/admin/websites?status=approved")}
            >
              {t("View All Active Websites")}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p>{t("No management records yet")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("Add management records to approved websites")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
