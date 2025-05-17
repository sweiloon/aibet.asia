import { DashboardLayout } from "@/components/DashboardLayout";
import { useWebsites, Website } from "@/context/WebsiteContext";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useState } from "react";
import { openInNewTab } from "@/lib/openInNewTab";
import { useTranslation } from "react-i18next";

const WebsiteRecords = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { websites } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const userApprovedWebsites = user
    ? websites.filter(
        (website) =>
          website.userid === user.id &&
          website.status === "approved" &&
          website.type === "website"
      )
    : [];

  const filteredWebsites = userApprovedWebsites.filter(
    (website) =>
      !searchTerm ||
      website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showWebsiteDetails = (website: Website) => {
    setSelectedWebsite(website);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("Website Records")}</h1>
        </div>

        {userApprovedWebsites.length > 0 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search websites...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        )}

        {filteredWebsites.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <p className="text-muted-foreground">
              {userApprovedWebsites.length === 0
                ? t("You don't have any approved websites yet")
                : t("No websites found matching your search")}
            </p>
            {searchTerm && (
              <Button
                variant="link"
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                {t("Clear search")}
              </Button>
            )}
          </div>
        ) : (
          filteredWebsites.map((website) => (
            <div key={website.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{website.name}</h2>
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
                      <TableHead>{t("Day")}</TableHead>
                      <TableHead>{t("Credit")}</TableHead>
                      <TableHead>{t("Profit")}</TableHead>
                      <TableHead>{t("Gross Profit")}</TableHead>
                      <TableHead>{t("Service Fee")}</TableHead>
                      <TableHead>{t("Start Date")}</TableHead>
                      <TableHead>{t("End Date")}</TableHead>
                      <TableHead>{t("Net Profit")}</TableHead>
                      <TableHead className="text-right">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...website.managementData]
                      .sort((a, b) => {
                        const dayA = Number(a.day) || 0;
                        const dayB = Number(b.day) || 0;
                        return dayB - dayA;
                      })
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.day}</TableCell>
                          <TableCell>{record.credit}</TableCell>
                          <TableCell>{record.profit}</TableCell>
                          <TableCell>{record.gross_profit}</TableCell>
                          <TableCell>{record.service_fee}</TableCell>
                          <TableCell>
                            {record.start_date
                              ? new Date(record.start_date)
                                  .toISOString()
                                  .split("T")[0]
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {record.end_date
                              ? new Date(record.end_date)
                                  .toISOString()
                                  .split("T")[0]
                              : "-"}
                          </TableCell>
                          <TableCell>{record.net_profit}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => showWebsiteDetails(website)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ))
        )}

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Website Details")}</DialogTitle>
            </DialogHeader>
            {selectedWebsite && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Name")}</Label>
                    <div className="font-medium">{selectedWebsite.name}</div>
                  </div>
                  <div>
                    <Label>{t("Status")}</Label>
                    <div className="font-medium capitalize">
                      {t(
                        selectedWebsite.status.charAt(0).toUpperCase() +
                          selectedWebsite.status.slice(1)
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>{t("URL")}</Label>
                  <div className="font-medium">
                    <a
                      href={selectedWebsite.url}
                      className="underline"
                      tabIndex={0}
                      role="link"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        openInNewTab(selectedWebsite.url);
                      }}
                    >
                      {selectedWebsite.url}
                    </a>
                  </div>
                </div>

                {selectedWebsite.adminUrl && (
                  <div>
                    <Label>{t("Login URL")}</Label>
                    <div className="font-medium">
                      <a
                        href={selectedWebsite.adminUrl}
                        className="underline"
                        tabIndex={0}
                        role="link"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          openInNewTab(selectedWebsite.adminUrl);
                        }}
                      >
                        {selectedWebsite.adminUrl}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={() => setIsDetailOpen(false)}
                    className="w-full"
                  >
                    {t("Close")}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteRecords;
