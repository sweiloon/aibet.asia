import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useAuth, User } from "@/context/AuthContext";
import { Search, Edit2, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const {
    user: currentUser,
    getAllUsers,
    deleteUser,
    updateUserStatus,
    updateUser,
  } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(t("Failed to load users"));
        setLoading(false);
      });
  }, [getAllUsers, currentUser, t]);

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast({
        title: t("User deleted"),
        description: t("The user has been successfully deleted."),
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      setLoading(true);
      getAllUsers()
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch(() => {
          setError(t("Failed to load users"));
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to delete user. Please try again."),
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateUserStatus(userId, newStatus);
      toast({
        title: t("Status updated"),
        description: t("User status changed to {{newStatus}}.", {
          newStatus: t(newStatus),
        }),
      });
      setLoading(true);
      getAllUsers()
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch(() => {
          setError(t("Failed to load users"));
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to update user status. Please try again."),
        variant: "destructive",
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

  const handleSaveUser = async (
    userId: string,
    userData: Partial<User>,
    newPassword?: string
  ) => {
    const success = await updateUser(userId, userData, newPassword);
    if (success) {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(t("Failed to load users"));
      } finally {
        setLoading(false);
      }
    }
    return success;
  };

  const getRankingBadge = (ranking: string | undefined) => {
    const rank = ranking || "customer";
    const rankKey = rank.charAt(0).toUpperCase() + rank.slice(1);
    return (
      <Badge className={`bg-${rank}-500/20 text-${rank}-300`}>
        {t(rankKey)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string | undefined) => {
    const roleKey = role
      ? role.charAt(0).toUpperCase() + role.slice(1)
      : "User";
    return (
      <Badge variant={role === "admin" ? "default" : "secondary"}>
        {t(roleKey)}
      </Badge>
    );
  };

  const getStatusDisplay = (status: string | undefined) => {
    const statusKey = status || "active";
    return t(statusKey);
  };

  const calculateDayCount = (createdAt?: string | number) => {
    if (!createdAt) return 0;
    const creationDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("User Management")}</h1>
          <p className="text-muted-foreground">
            {t("View and manage users of the platform")}
          </p>
        </div>
        {loading ? (
          <div className="text-center p-10">{t("Loading users...")}</div>
        ) : error ? (
          <div className="text-center p-10 text-red-500">{error}</div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search by email or name...")}
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
                      <TableHead>{t("Email")}</TableHead>
                      <TableHead>{t("Role")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                      <TableHead>{t("Joined")}</TableHead>
                      <TableHead>{t("Day Count")}</TableHead>
                      <TableHead>{t("Ranking")}</TableHead>
                      <TableHead className="text-right">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.email}
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                user.status === "active"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-red-500/20 text-red-300"
                              }
                              onClick={() =>
                                user.id !== currentUser?.id &&
                                handleToggleUserStatus(
                                  user.id,
                                  user.status || "active"
                                )
                              }
                            >
                              {getStatusDisplay(user.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              user.createdAt || Date.now()
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {calculateDayCount(user.createdAt)}
                          </TableCell>
                          <TableCell>{getRankingBadge(user.ranking)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0"
                                title={t("Edit user")}
                                onClick={() => openEditDialog(user)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0"
                                title={t("Delete user")}
                                onClick={() => confirmDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          {t("No users found.")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Delete User")}</DialogTitle>
            <DialogDescription>
              {t(
                "Are you sure you want to delete this user? This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditUserDialog
        user={userToEdit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveUser}
        t={t}
        i18n={i18n}
      />
    </DashboardLayout>
  );
}
