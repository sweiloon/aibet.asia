import { Website } from "@/context/WebsiteContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "./StatusBadgeHelper";
import { openInNewTab } from "@/lib/openInNewTab";

interface WebsiteHeaderProps {
  website: Website;
  onBack: () => void;
}

export function WebsiteHeader({ website, onBack }: WebsiteHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">{website.name}</h1>
          {getStatusBadge(website.status)}
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

      <Button variant="outline" onClick={onBack}>
        Back to Websites
      </Button>
    </div>
  );
}
