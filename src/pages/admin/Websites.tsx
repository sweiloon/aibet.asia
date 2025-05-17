import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsites } from "@/context/WebsiteContext";
import { Search, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";

export default function AdminWebsites() {
  const { t } = useTranslation();
  const { getAllWebsites } = useWebsites();
  const websites = getAllWebsites();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Set initial status filter based on URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status) {
      // We can still honor status from URL by filtering in the search function
      if (status !== "all") {
        setSearchTerm(status);
      }
    }
  }, [location.search]);

  const filteredWebsites = websites.filter((website) => {
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();

    // Include translated status in search
    const translatedStatus = t(
      website.status.charAt(0).toUpperCase() + website.status.slice(1)
    ).toLowerCase();

    return (
      website.name.toLowerCase().includes(searchTermLower) ||
      website.url.toLowerCase().includes(searchTermLower) ||
      website.status.toLowerCase().includes(searchTermLower) ||
      translatedStatus.includes(searchTermLower) || // Search by translated status
      (website.useremail &&
        website.useremail.toLowerCase().includes(searchTermLower))
    );
  });

  const getStatusBadge = (status: string) => {
    const statusKey = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter for key
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
            {t(statusKey)}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
            {t(statusKey)}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
            {t(statusKey)}
          </Badge>
        );
      default:
        return <Badge>{t(statusKey)}</Badge>; // Fallback for other statuses if any
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Manage Websites")}</h1>
          <p className="text-muted-foreground">
            {t("Review and manage all websites in the system")}
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search by name, URL, status, or user email...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <button
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Card className="glass-morphism">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("URL")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("User")}</TableHead>
                  <TableHead>{t("Submitted")}</TableHead>
                  <TableHead>{t("Records")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebsites.length > 0 ? (
                  filteredWebsites.map((website) => {
                    // Get user info (in a real app would fetch from database)
                    const userEmail = website.useremail || "user@aibet.asia"; // Placeholder

                    return (
                      <TableRow key={website.id}>
                        <TableCell className="font-medium">
                          {website.name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={
                              website.url.startsWith("http")
                                ? website.url
                                : `https://${website.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {website.url}
                          </a>
                        </TableCell>
                        <TableCell>{getStatusBadge(website.status)}</TableCell>
                        <TableCell>{userEmail}</TableCell>
                        <TableCell>
                          {new Date(website.createdat).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{website.managementData.length}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (
                                website.type === "id-card" ||
                                website.type === "bank-statement"
                              ) {
                                toast.info(
                                  t(
                                    "This document submission does not have management records."
                                  )
                                );
                              } else if (website.status === "approved") {
                                navigate(
                                  `/admin/website-records?websiteId=${website.id}`
                                );
                              } else if (website.status === "rejected") {
                                toast.error(
                                  t(
                                    "This website is rejected. No records available."
                                  )
                                );
                              } else if (website.status === "pending") {
                                navigate("/admin/approvals");
                              }
                            }}
                          >
                            {t("Manage")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <p>{t("No websites found matching your search")}</p>
                      {searchTerm && (
                        <Button
                          variant="link"
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          {t("Clear search")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
