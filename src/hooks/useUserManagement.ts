
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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Only admins should be able to see this data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      // Only admins can delete users
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error);
        return false;
      }

      toast.success("User deleted successfully");
      setConfirmingDelete(null);
      
      // Refresh the user list
      fetchUsers();
      return true;
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", err);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    confirmingDelete,
    setConfirmingDelete
  };
};
