
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { User } from "@/types/auth";

interface UserTableProps {
  users: User[];
  currentUser: User | null;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const UserTable = ({
  users,
  currentUser,
  onEdit,
  onDelete,
  onToggleStatus,
  searchTerm,
  setSearchTerm
}: UserTableProps) => {
  
  // Get ranking badge based on ranking
  const getRankingBadge = (ranking: string) => {
    switch (ranking) {
      case "customer":
        return <Badge className="bg-blue-500/20 text-blue-300">Customer</Badge>;
      case "agent":
        return <Badge className="bg-green-500/20 text-green-300">Agent</Badge>;
      case "master":
        return <Badge className="bg-purple-500/20 text-purple-300">Master</Badge>;
      case "senior":
        return <Badge className="bg-yellow-500/20 text-yellow-300">Senior</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300">Customer</Badge>; // Default to Customer
    }
  };
  
  // Calculate days since account creation
  const calculateDayCount = (createdAt?: string | number) => {
    if (!createdAt) return 0;
    
    const creationDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Day Count</TableHead>
          <TableHead>Ranking</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={user.status === "active" ? "bg-green-500/20 text-green-300" : ""}
                  onClick={() => user.id !== currentUser?.id && onToggleStatus(user.id, user.status || "active")}
                >
                  {user.status || "active"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</TableCell>
              <TableCell>{calculateDayCount(user.createdAt)}</TableCell>
              <TableCell>{getRankingBadge(user.ranking || "customer")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    title="Edit user"
                    onClick={() => onEdit(user)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-red-500/20 hover:text-red-300"
                    title="Delete user"
                    onClick={() => onDelete(user.id)}
                    disabled={user.id === currentUser?.id || (user.role === "admin" && user.id !== currentUser?.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              <p>No users found matching your search</p>
              {searchTerm && (
                <Button
                  variant="link"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
