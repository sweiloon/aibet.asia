import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  createdAt?: string;
  websites?: any[];
  ranking?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  signup: (email: string, password: string, phone: string, name: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string, newStatus: string) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>, newPassword?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  changePassword: async () => false,
  checkAdminExists: async () => false,
  getAllUsers: async () => [],
  deleteUser: async () => false,
  updateUserStatus: async () => false,
  updateUser: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Set up auth state subscription
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          // Convert Supabase user to our User format
          const currentUser = mapSupabaseUser(session.user);
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Then, check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Convert Supabase user to our User format
          const currentUser = mapSupabaseUser(session.user);
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to map Supabase user to our format
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
    const metadata = supabaseUser.user_metadata || {};
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: metadata.name || metadata.full_name,
      role: metadata.role || "user",
      phone: metadata.phone,
      ranking: metadata.ranking || "customer",
      createdAt: supabaseUser.created_at,
    };
  };
  
  // Check if admin exists
  const checkAdminExists = async (): Promise<boolean> => {
    try {
      // Fixed type assertion for RPC call
      const { data, error } = await (supabase
        .rpc('check_admin_exists') as Promise<{ data: any, error: any }>);
      
      if (error) {
        // Fixed type assertion for from method
        const { data: fallbackData, error: fallbackError } = await (supabase
          .from('user_roles' as any)
          .select('user_id')
          .eq('role', 'admin')
          .limit(1)
          .single() as Promise<{ data: any, error: any }>);
        
        if (fallbackError && fallbackError.code !== 'PGRST116') {
          console.error("Error checking admin existence:", fallbackError);
          return false;
        }
        
        return !!fallbackData;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking admin existence:", error);
      return false;
    }
  };
  
  // Sign in with email and password
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (!data.user) {
        toast.error("Login failed: No user data returned");
        return false;
      }

      // For admin login, verify the user has admin role
      if (isAdmin) {
        // Fixed type assertion for RPC call
        const { data: roleData, error: roleError } = await (supabase
          .rpc('check_user_is_admin', { user_id: data.user.id }) as Promise<{ data: any, error: any }>);
        
        if (roleError || !roleData) {
          // Fallback method
          const { data: fallbackData, error: fallbackError } = await (supabase
            .from('user_roles' as any)
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle() as Promise<{ data: any, error: any }>);
          
          if (fallbackError || !fallbackData) {
            toast.error("You don't have admin permissions");
            await supabase.auth.signOut();
            return false;
          }
        }
      }
      
      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      toast.error(`Login error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email, password, and additional user data
  const signup = async (email: string, password: string, phone: string, name: string, isAdmin = false): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      
      // Validate phone number (must start with +60 followed by 1-9)
      const phonePattern = /^\+60[1-9]/;
      if (!phonePattern.test(phone)) {
        toast.error("Phone number must start with +60 followed by a digit from 1-9");
        return false;
      }
      
      // For admin signup, check if admin already exists
      if (isAdmin) {
        const adminExists = await checkAdminExists();
        if (adminExists) {
          toast.error("An admin account already exists!");
          return false;
        }
      }
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            phone,
            role: isAdmin ? "admin" : "user",
            ranking: "customer", // Default ranking
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (!data.user) {
        toast.error("Signup failed: No user data returned");
        return false;
      }
      
      // If admin signup, create entry in user_roles table
      if (isAdmin && data.user) {
        // Fixed type assertion for RPC call
        const { error: roleError } = await (supabase
          .rpc('insert_admin_role', { admin_user_id: data.user.id }) as Promise<{ data: any, error: any }>);
        
        if (roleError) {
          // Fallback method using type assertion for table that doesn't exist in types
          const { error: fallbackError } = await (supabase
            .from('user_roles' as any)
            .insert({
              user_id: data.user.id,
              role: 'admin'
            }) as Promise<{ data: any, error: any }>);
          
          if (fallbackError) {
            toast.error(`Error setting admin role: ${fallbackError.message}`);
            return false;
          }
        }
      }
      
      toast.success(isAdmin ? "Admin account created successfully!" : "Account created successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Signup error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Log out
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(`Logout error: ${error.message}`);
    }
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // First, verify current password by trying to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (verifyError) {
        toast.error("Current password is incorrect!");
        return false;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error(`Failed to change password: ${error.message}`);
        return false;
      }
      
      toast.success("Password updated successfully!");
      return true;
    } catch (error: any) {
      toast.error(`Password change error: ${error.message}`);
      return false;
    }
  };

  // Get all users (admin only)
  const getAllUsers = async (): Promise<User[]> => {
    try {
      if (!user || user.role !== "admin") {
        return [];
      }
      
      // Fixed type assertion for RPC call
      const { data, error } = await (supabase
        .rpc('get_all_users') as Promise<{ data: any[], error: any }>);
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return [];
      }
      
      // Map returned data to our User format
      return data.map((u: any) => ({
        id: u.id,
        email: u.email || '',
        name: u.name || "",
        role: u.role || "user",
        status: (u.status === 'inactive' ? "inactive" : "active") as "active" | "inactive",
        createdAt: u.created_at,
        websites: [],
        ranking: u.ranking || "customer",
        phone: u.phone
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Delete user (admin only)
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Fixed type assertion for RPC call
      const { error } = await (supabase
        .rpc('delete_user', { user_id_to_delete: userId }) as Promise<{ data: any, error: any }>);
      
      if (error) {
        console.error("Error deleting user:", error);
        // Try the direct admin API as fallback - type assert to avoid TypeScript errors
        const adminAuth = supabase.auth.admin as any;
        if (adminAuth && adminAuth.deleteUser) {
          const { error: directError } = await adminAuth.deleteUser(userId);
          
          if (directError) {
            console.error("Direct API error:", directError);
            return false;
          }
        } else {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  // Update user status (admin only)
  const updateUserStatus = async (userId: string, newStatus: string): Promise<boolean> => {
    try {
      // Fixed type assertion for RPC call
      const { error } = await (supabase
        .rpc('update_user_status', { 
          user_id_to_update: userId, 
          new_status: newStatus 
        }) as Promise<{ data: any, error: any }>);
      
      if (error) {
        console.error("Error updating user status:", error);
        
        // Fallback to direct API - type assert to avoid TypeScript errors
        const adminAuth = supabase.auth.admin as any;
        if (adminAuth && adminAuth.updateUserById) {
          const { error: directError } = await adminAuth.updateUserById(
            userId,
            { user_metadata: { status: newStatus } }
          );
          
          if (directError) {
            console.error("Direct API error:", directError);
            return false;
          }
        } else {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      return false;
    }
  };

  // Update user (admin only)
  const updateUser = async (userId: string, userData: Partial<User>, newPassword?: string): Promise<boolean> => {
    try {
      // Fixed type assertion for RPC call
      const { error } = await (supabase
        .rpc('update_user_profile', { 
          user_id_to_update: userId,
          user_name: userData.name || null,
          user_role: userData.role || null,
          user_ranking: userData.ranking || null,
          user_phone: userData.phone || null,
          user_password: newPassword || null
        }) as Promise<{ data: any, error: any }>);
      
      if (error) {
        // Fallback to direct API
        const updateData: any = {
          user_metadata: {}
        };
        
        if (userData.name) updateData.user_metadata.name = userData.name;
        if (userData.role) updateData.user_metadata.role = userData.role;
        if (userData.ranking) updateData.user_metadata.ranking = userData.ranking;
        if (userData.phone) updateData.user_metadata.phone = userData.phone;
        
        // Update password if provided
        if (newPassword) {
          updateData.password = newPassword;
        }
        
        const adminAuth = supabase.auth.admin as any;
        if (adminAuth && adminAuth.updateUserById) {
          const { error: directError } = await adminAuth.updateUserById(userId, updateData);
          
          if (directError) {
            toast.error(`User update error: ${directError.message}`);
            return false;
          }
        } else {
          return false;
        }
      }
      
      // If current user is being updated, update the user in state
      if (user && user.id === userId) {
        const currentUserObj = {
          ...user,
          ...userData,
        };
        setUser(currentUserObj);
      }
      
      toast.success("User updated successfully!");
      return true;
    } catch (error: any) {
      toast.error(`User update error: ${error.message}`);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      changePassword, 
      checkAdminExists,
      getAllUsers,
      deleteUser,
      updateUserStatus,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
