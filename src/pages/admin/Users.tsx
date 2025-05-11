
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useUserManagement } from "@/hooks/useUserManagement";
import { EditUserDialog } from "@/components/EditUserDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

export default function AdminUsers() {
  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    deleteUser
  } = useUserManagement();

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    // Handle errors from useUserManagement
    if (error) {
      toast.error(error || "Failed to load users");
    }
  }, [error]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleEditUser = (user: any) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete);
      if (success) {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users and their permissions</p>
        </div>
        
        <div className="rounded-md border glass-morphism">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">User</TableHead>
                <TableHead>Name & Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">Loading users...</TableCell>
                </TableRow>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`} />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-muted-foreground">{user.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.created_at 
                        ? format(new Date(user.created_at), "MMM d, yyyy")
                        : "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Edit user"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Delete user" 
                          onClick={() => handleConfirmDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    {error ? `Error: ${error}` : "No users found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <EditUserDialog 
        user={editingUser} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        onUserUpdated={fetchUsers}
      />

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
