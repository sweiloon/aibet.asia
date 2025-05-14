import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabaseClient";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  createdAt?: string;
  ranking?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    isAdmin: boolean
  ) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    phone: string,
    name: string,
    isAdmin?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string, newStatus: string) => Promise<boolean>;
  updateUser: (
    userId: string,
    userData: Partial<User>,
    newPassword?: string
  ) => Promise<boolean>;
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

  // Fetch user profile from users table
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data as User;
  };

  // Check if admin exists in users table
  const checkAdminExists = async (): Promise<boolean> => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin");
    return !!(data && data.length > 0);
  };

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Supabase session after refresh:", session);
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          console.log("Fetched profile after refresh:", profile);
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log("onAuthStateChange event:", event, "session:", session);
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            console.log("Fetched profile in onAuthStateChange:", profile);
            if (profile) {
              setUser(profile);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Error in onAuthStateChange:", err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login with Supabase Auth
  const login = async (
    email: string,
    password: string,
    isAdmin: boolean
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Append domain if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.user) {
        toast.error("Invalid credentials!");
        return false;
      }
      // Fetch user profile
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) {
        toast.error("User profile not found!");
        return false;
      }
      if (isAdmin && profile.role !== "admin") {
        toast.error("Not an admin account!");
        return false;
      }
      setUser(profile);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      toast.error("Login failed!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup with Supabase Auth and insert profile
  const signup = async (
    email: string,
    password: string,
    phone: string,
    name: string,
    isAdmin = false
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Append domain if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      // Basic email and password validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      console.log("Auth signUp result:", { data, error });
      if (error || !data.user) {
        toast.error(error?.message || "Signup failed!");
        return false;
      }
      // Insert profile into users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: email.trim(),
          name,
          phone,
          role: isAdmin ? "admin" : "user",
          status: "active",
          ranking: "customer",
        },
      ]);
      console.log("Insert profile result:", { profileError });
      if (profileError) {
        toast.error(profileError.message || "Failed to create user profile!");
        return false;
      }
      toast.success("Account created successfully!");
      return true;
    } catch (error: unknown) {
      let message = "Signup failed!";
      if (typeof error === "object" && error && "message" in error) {
        const err = error as { message?: string };
        if (typeof err.message === "string") {
          message = err.message;
        }
      }
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout with Supabase Auth
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
  };

  // Change password (no re-auth, just update and logout)
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      if (!user?.email) {
        toast.error("User email not found. Please re-login.");
        return false;
      }
      // Directly update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error(error.message || "Failed to update password.");
        return false;
      }
      toast.success("Password updated successfully!");
      // Do not call logout or setUser here
      return true;
    } catch (err) {
      toast.error("Failed to update password.");
      return false;
    }
  };

  // Get all users (admin only)
  const getAllUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return [];
    return data as User[];
  };

  // Delete user (admin only)
  const deleteUser = async (userId: string): Promise<boolean> => {
    const { error } = await supabase.from("users").delete().eq("id", userId);
    return !error;
  };

  // Update user status (admin only)
  const updateUserStatus = async (
    userId: string,
    newStatus: string
  ): Promise<boolean> => {
    const { error } = await supabase
      .from("users")
      .update({ status: newStatus })
      .eq("id", userId);
    return !error;
  };

  // Update user profile (admin or self)
  const updateUser = async (
    userId: string,
    userData: Partial<User>,
    newPassword?: string
  ): Promise<boolean> => {
    const { error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", userId);
    return !error;
  };

  return (
    <AuthContext.Provider
      value={{
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
