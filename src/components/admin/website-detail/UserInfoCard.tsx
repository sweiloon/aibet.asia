
import { Website } from "@/context/WebsiteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoCardProps {
  website: Website;
}

export function UserInfoCard({ website }: UserInfoCardProps) {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>User Info</CardTitle>
        <CardDescription>Website owner details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">User ID:</span>
            <div className="font-medium">{website.userId}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Email:</span>
            <div className="font-medium">{website.userEmail || "user@aibet.asia"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
