import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites } from "@/context/WebsiteContext";
import { StatsCards } from "@/components/admin/StatsCards";
import { PendingApprovalsCard } from "@/components/admin/PendingApprovalsCard";
import { RecentManagementCard } from "@/components/admin/RecentManagementCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { getAllWebsites } = useWebsites();
  const navigate = useNavigate();

  const websites = getAllWebsites();

  const pendingCount = websites.filter(
    (site) => site.status === "pending"
  ).length;
  const approvedCount = websites.filter(
    (site) => site.status === "approved"
  ).length;

  const latestPendingWebsites = websites
    .filter((site) => site.status === "pending")
    .sort(
      (a, b) =>
        new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
    )
    .slice(0, 3);

  const websitesWithRecords = websites
    .filter(
      (site) => site.status === "approved" && site.managementData.length > 0
    )
    .sort((a, b) => {
      const latestA = [...a.managementData].sort((x, y) => {
        const dateA = x.start_date;
        const dateB = y.start_date;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];
      const latestB = [...b.managementData].sort((x, y) => {
        const dateA = x.start_date;
        const dateB = y.start_date;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];
      const dateA = latestA.start_date;
      const dateB = latestB.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);

  // Breakdown by type
  const countByType = (arr) => ({
    website: arr.filter((site) => site.type === "website").length,
    idCard: arr.filter((site) => site.type === "id-card").length,
    bank: arr.filter((site) => site.type === "bank-statement").length,
  });

  const totalBreakdown = countByType(websites);
  const pendingBreakdown = countByType(
    websites.filter((site) => site.status === "pending")
  );
  const activeBreakdown = countByType(
    websites.filter((site) => site.status === "approved")
  );

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Admin Dashboard")}</h1>
          <p className="text-muted-foreground">
            {t("Manage all websites and user accounts")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#18181b] rounded-2xl p-7 flex flex-col justify-between border border-[#232329] shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#232329] text-white text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 4v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3"
                  />
                </svg>
              </span>
              <div>
                <div className="text-4xl font-extrabold text-white">
                  {websites.length}
                </div>
                <div className="text-zinc-300 font-medium">
                  {t("Total Websites")}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-zinc-400 space-y-1">
              <div>
                {t("Website Submission")}: {totalBreakdown.website}
              </div>
              <div>
                {t("ID Card Submission")}: {totalBreakdown.idCard}
              </div>
              <div>
                {t("Bank Submission")}: {totalBreakdown.bank}
              </div>
            </div>
            <div className="mt-6">
              <button
                className="text-zinc-200 text-sm font-semibold flex items-center gap-1 hover:underline"
                onClick={() => navigate("/admin/websites")}
              >
                {t("View All")} <span>&rarr;</span>
              </button>
            </div>
          </div>
          <div className="bg-[#18181b] rounded-2xl p-7 flex flex-col justify-between border border-[#232329] shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#232329] text-white text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                  />
                </svg>
              </span>
              <div>
                <div className="text-4xl font-extrabold text-white">
                  {pendingCount}
                </div>
                <div className="text-zinc-300 font-medium">
                  {t("Pending Websites")}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-zinc-400 space-y-1">
              <div>
                {t("Website Submission")}: {pendingBreakdown.website}
              </div>
              <div>
                {t("ID Card Submission")}: {pendingBreakdown.idCard}
              </div>
              <div>
                {t("Bank Submission")}: {pendingBreakdown.bank}
              </div>
            </div>
            <div className="mt-6">
              <button
                className="text-zinc-200 text-sm font-semibold flex items-center gap-1 hover:underline"
                onClick={() => navigate("/admin/approvals")}
              >
                {t("Review Pending")} <span>&rarr;</span>
              </button>
            </div>
          </div>
          <div className="bg-[#18181b] rounded-2xl p-7 flex flex-col justify-between border border-[#232329] shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#232329] text-white text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <div>
                <div className="text-4xl font-extrabold text-white">
                  {approvedCount}
                </div>
                <div className="text-zinc-300 font-medium">
                  {t("Active Websites")}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-zinc-400 space-y-1">
              <div>
                {t("Website Submission")}: {activeBreakdown.website}
              </div>
              <div>
                {t("ID Card Submission")}: {activeBreakdown.idCard}
              </div>
              <div>
                {t("Bank Submission")}: {activeBreakdown.bank}
              </div>
            </div>
            <div className="mt-6">
              <button
                className="text-zinc-200 text-sm font-semibold flex items-center gap-1 hover:underline"
                onClick={() => navigate("/admin/website-records")}
              >
                {t("View Active")} <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PendingApprovalsCard
            pendingWebsites={latestPendingWebsites}
            pendingCount={pendingCount}
          />

          <RecentManagementCard websitesWithRecords={websitesWithRecords} />
        </div>
      </div>
    </DashboardLayout>
  );
}
