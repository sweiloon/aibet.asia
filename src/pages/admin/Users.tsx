
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { UserTable } from "@/components/admin/UserTable";
import { UserSearch } from "@/components/admin/UserSearch";
import { User } from "@/types/auth";
import { UserDeleteDialog } from "@/components/admin/UserDeleteDialog";

export default function AdminUsers() {
  const { user: currentUser, getAllUsers, deleteUser, updateUserStatus, updateUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Get all users from auth context
  const allUsers = getAllUsers();
  
  // Filter users based on search term
  const filteredUsers = allUsers.filter(u => 
    (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete);
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await updateUserStatus(userId, newStatus);
      toast({
        title: "Status updated",
        description: `User status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveUser = async (userId: string, userData: Partial<User>, newPassword?: string) => {
    return await updateUser(userId, userData, newPassword);
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage users of the platform</p>
        </div>
        
        <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <Card className="glass-morphism">
          <CardContent className="p-0">
            <UserTable 
              users={filteredUsers}
              currentUser={currentUser}
              onEdit={openEditDialog}
              onDelete={confirmDelete}
              onToggleStatus={handleToggleUserStatus}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <UserDeleteDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        user={userToEdit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveUser}
      />
    </DashboardLayout>
  );
}
