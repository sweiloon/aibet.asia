import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Website } from "@/context/WebsiteContext";
import { useTranslation } from "react-i18next";

interface StatisticsCardsProps {
  websites: Website[];
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function StatisticsCards({
  websites,
  pendingCount,
  approvedCount,
  rejectedCount,
}: StatisticsCardsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-morphism">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold">
            {websites.length}
          </CardTitle>
          <CardDescription>{t("Total Websites")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t("All websites submitted to our platform")}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold">{approvedCount}</CardTitle>
          <CardDescription>{t("Active Websites")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t("Websites currently under active management")}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold">{pendingCount}</CardTitle>
          <CardDescription>{t("Pending Approval")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t("Websites waiting for admin approval")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
