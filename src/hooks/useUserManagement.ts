
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  role: string;
  phone: string | null;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Only fetch non-admin users
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "user") // Only fetch users with role="user"
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Fetched users:", data);
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // First delete from auth (this cascades to profiles due to references)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error);
        return false;
      }

      toast.success("User deleted successfully");
      
      // Refresh the user list
      await fetchUsers();
      return true;
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    confirmingDelete,
    setConfirmingDelete,
    editingUser,
    setEditingUser
  };
};
