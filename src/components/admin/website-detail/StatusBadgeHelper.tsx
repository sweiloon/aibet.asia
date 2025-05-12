
import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Completed</Badge>;
    case "in-progress":
      return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">In Progress</Badge>;
    case "pending":
      return <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">Pending</Badge>;
    case "approved":
      return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">Rejected</Badge>;
    default:
      return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">Pending</Badge>;
  }
}
