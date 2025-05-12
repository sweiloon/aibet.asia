
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SubmissionInfoCardProps {
  website: Website;
}

export function SubmissionInfoCard({ website }: SubmissionInfoCardProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Submission Info</CardTitle>
        <CardDescription>Website submission details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Submitted On:</span>
            <div className="font-medium">{new Date(website.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Management Records:</span>
            <div className="font-medium">{website.managementData.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
