import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsites } from "@/context/WebsiteContext";
import { Website } from "@/context/WebsiteContext";
import { openInNewTab } from "@/lib/openInNewTab";

export default function WebsiteDetail() {
  const { id } = useParams();
  const [website, setWebsite] = useState<Website | null>(null);
  const { getUserWebsites } = useWebsites();
  const navigate = useNavigate();

  useEffect(() => {
    const userWebsites = getUserWebsites();
    const foundWebsite = userWebsites.find((site) => site.id === id);
    setWebsite(foundWebsite || null);
  }, [id, getUserWebsites]);

  if (!website) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Website not found</h2>
          <Button
            onClick={() => navigate("/dashboard/websites")}
            className="mt-4"
          >
            Back to Websites
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold">{website.name}</h1>
              <Badge
                className={
                  website.status === "approved"
                    ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                    : website.status === "rejected"
                    ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    : "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                }
              >
                {website.status.charAt(0).toUpperCase() +
                  website.status.slice(1)}
              </Badge>
            </div>
            <a
              href={website.url}
              className="text-blue-400 hover:underline text-sm"
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

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/websites")}
          >
            Back to Websites
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Website Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Current Status:
                  </span>
                  <div className="font-medium capitalize">{website.status}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Submitted On:
                  </span>
                  <div className="font-medium">
                    {new Date(website.createdat).toLocaleDateString()}
                  </div>
                </div>
                {website.status === "pending" && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Your website is currently under review. Our team will
                    approve it soon.
                  </p>
                )}
                {website.status === "rejected" && (
                  <p className="text-sm text-red-300 mt-4">
                    Your website was rejected. Please contact support for more
                    information.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {website.loginUrl && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Admin URL:
                    </span>
                    <div className="font-medium">
                      <a
                        href={website.loginUrl}
                        className="text-blue-400 hover:underline"
                        tabIndex={0}
                        role="link"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          openInNewTab(website.loginUrl);
                        }}
                      >
                        {website.loginUrl}
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Username:
                    </span>
                    <div className="font-medium">{website.username}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Password:
                    </span>
                    <div className="font-medium">••••••••</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Management Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Total Records:
                  </span>
                  <div className="font-medium">
                    {website.managementData.length}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Latest Update:
                  </span>
                  <div className="font-medium">
                    {website.managementData.length > 0
                      ? new Date(
                          [...website.managementData].sort((a, b) => {
                            const dateA = a.date || a.start_date;
                            const dateB = b.date || b.start_date;
                            return (
                              new Date(dateB).getTime() -
                              new Date(dateA).getTime()
                            );
                          })[0].date ||
                            [...website.managementData].sort((a, b) => {
                              const dateA = a.date || a.start_date;
                              const dateB = b.date || b.start_date;
                              return (
                                new Date(dateB).getTime() -
                                new Date(dateA).getTime()
                              );
                            })[0].start_date
                        ).toLocaleDateString()
                      : "No updates yet"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Management History</CardTitle>
            <CardDescription>
              Records of activities performed on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {website.managementData.length > 0 ? (
              <div className="space-y-6">
                {[...website.managementData]
                  .sort((a, b) => {
                    const dateA = a.date || a.start_date;
                    const dateB = b.date || b.start_date;
                    return (
                      new Date(dateB).getTime() - new Date(dateA).getTime()
                    );
                  })
                  .map((record) => (
                    <div
                      key={record.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="font-medium text-lg mb-3">
                        {new Date(
                          record.date || record.start_date
                        ).toLocaleDateString()}
                      </div>
                      {record.tasks && record.tasks.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Task Type</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {record.tasks.map((task, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {task.type}
                                </TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>
                                  {getStatusBadge(task.status)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <strong>Day:</strong> {record.day}
                          </div>
                          <div>
                            <strong>Credit:</strong> {record.credit}
                          </div>
                          <div>
                            <strong>Profit:</strong> {record.profit}
                          </div>
                          <div>
                            <strong>Gross Profit:</strong>{" "}
                            {record.gross_profit ?? "-"}
                          </div>
                          <div>
                            <strong>Service Fee:</strong>{" "}
                            {record.service_fee ?? "-"}
                          </div>
                          <div>
                            <strong>Start Date:</strong>{" "}
                            {record.start_date
                              ? new Date(record.start_date).toLocaleDateString()
                              : "-"}
                          </div>
                          <div>
                            <strong>End Date:</strong>{" "}
                            {record.end_date
                              ? new Date(record.end_date).toLocaleDateString()
                              : "-"}
                          </div>
                          <div>
                            <strong>Net Profit:</strong>{" "}
                            {record.net_profit ?? "-"}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p>No management records available yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {website.status === "approved"
                    ? "Our team will start managing your website soon."
                    : "Management records will be available after approval."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
