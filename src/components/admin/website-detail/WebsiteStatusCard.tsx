
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WebsiteStatusCardProps {
  website: Website;
  onStatusChange: (status: Website["status"]) => void;
}

export function WebsiteStatusCard({ website, onStatusChange }: WebsiteStatusCardProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Status</CardTitle>
        <CardDescription>Current website status</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={website.status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
