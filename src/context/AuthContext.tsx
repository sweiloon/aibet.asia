import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

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
  getAllUsers: () => User[];
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string, newStatus: string) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>, newPassword?: string) => Promise<boolean>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  changePassword: async () => false,
  checkAdminExists: async () => false,
  getAllUsers: () => [],
  deleteUser: async () => false,
  updateUserStatus: async () => false,
  updateUser: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Get user profile from database
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: profile.name,
                role: (profile.role as "user" | "admin") || "user",
                status: (profile.status as "active" | "inactive") || "active",
                createdAt: profile.created_at,
                ranking: profile.ranking || "customer",
                phone: profile.phone
              });
            } else {
              // If no profile, just use basic user info
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                role: "user",
                ranking: "customer"
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Get user profile data
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: profile.name,
                role: (profile.role as "user" | "admin") || "user",
                status: (profile.status as "active" | "inactive") || "active",
                createdAt: profile.created_at,
                ranking: profile.ranking || "customer",
                phone: profile.phone
              });
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                role: "user",
                ranking: "customer"
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Check if admin exists
  const checkAdminExists = async (): Promise<boolean> => {
    try {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: 'exact' })
        .eq("role", "admin")
        .limit(1);
        
      return (count || 0) > 0;
    } catch (error) {
      console.error("Error checking admin existence:", error);
      
      // Fallback to checking localStorage if API fails
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some((user: any) => user.role === "admin");
      } catch (e) {
        return false;
      }
    }
  };
  
  // Login function
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }

      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Fallback to mock login for admin if default admin
        if (isAdmin && email === "admin@aibet.asia" && password === "admin123") {
          const adminUser = { id: "admin1", email: "admin@aibet.asia", role: "admin" as const };
          setUser(adminUser);
          localStorage.setItem('user', JSON.stringify(adminUser));
          toast.success("Admin login successful!");
          return true;
        }
        
        // Fallback to local storage login if Supabase fails
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (isAdmin) {
          const adminUser = users.find((u: any) => u.email === email && u.role === "admin");
          
          if (adminUser && adminUser.password === password) {
            const userObj = { 
              id: adminUser.id, 
              email: adminUser.email, 
              role: "admin" as const,
              ranking: adminUser.ranking || "customer"
            };
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
            toast.success("Admin login successful!");
            return true;
          } else {
            toast.error("Invalid admin credentials!");
            return false;
          }
        } else {
          const matchedUser = users.find((u: any) => u.email === email);
          
          if (matchedUser && matchedUser.password === password) {
            const userObj = { 
              id: matchedUser.id, 
              email: matchedUser.email, 
              role: matchedUser.role || "user" as const,
              ranking: matchedUser.ranking || "customer",
              name: matchedUser.name,
              phone: matchedUser.phone
            };
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
            toast.success("Login successful!");
            return true;
          } else {
            toast.error("Invalid credentials!");
            return false;
          }
        }
      }

      if (isAdmin) {
        // Check if the user has admin role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user?.id)
          .single();
          
        if (profile?.role !== "admin") {
          await supabase.auth.signOut();
          toast.error("You don't have admin privileges!");
          return false;
        }
      }

      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function
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
      
      // Create new user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: isAdmin ? "admin" : "user",
            ranking: "customer"
          }
        }
      });
      
      if (error) {
        // Fallback to localStorage if Supabase fails
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some((u: any) => u.email === email)) {
          toast.error("Account already exists with this email!");
          return false;
        }
        
        // Check if phone number already exists
        if (users.some((u: any) => u.phone === phone)) {
          toast.error("This phone number has already been registered!");
          return false;
        }
        
        // Create new user
        const newUser = {
          id: `user${Date.now()}`,
          email,
          password,
          phone,
          name,
          role: isAdmin ? "admin" : "user",
          createdAt: new Date().toISOString(),
          ranking: "customer"
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login after signup
        const userObj = { 
          id: newUser.id, 
          email: newUser.email, 
          role: isAdmin ? "admin" as const : "user" as const,
          ranking: "customer",
          name: newUser.name,
          phone: newUser.phone
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        
        toast.success(isAdmin ? "Admin account created successfully!" : "Account created successfully!");
        return true;
      }
      
      toast.success(isAdmin ? "Admin account created successfully!" : "Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed!");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
    
    // Also clear local storage
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
  };
  
  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // For Supabase, we need to use the update function
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        // Fallback to local storage
        if (user.role === "admin") {
          // Admin password change
          if (user.email === "admin@aibet.asia" && currentPassword !== "admin123") {
            toast.error("Current password is incorrect!");
            return false;
          }
          
          // Check for custom admin account
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.email === user.email);
          
          if (userIndex !== -1) {
            if (users[userIndex].password !== currentPassword) {
              toast.error("Current password is incorrect!");
              return false;
            }
            
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            toast.success("Password updated successfully!");
            return true;
          }
          
          toast.success("Admin password would be updated in a real application!");
          return true;
        } else {
          // User password change
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.email === user.email);
          
          if (userIndex === -1) {
            toast.error("User not found!");
            return false;
          }
          
          if (users[userIndex].password !== currentPassword) {
            toast.error("Current password is incorrect!");
            return false;
          }
          
          users[userIndex].password = newPassword;
          localStorage.setItem('users', JSON.stringify(users));
          toast.success("Password updated successfully!");
          return true;
        }
      }
      
      toast.success("Password updated successfully!");
      return true;
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password!");
      return false;
    }
  };

  // Get all users function
  const getAllUsers = (): User[] => {
    try {
      // First try to get users from localStorage as fallback
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]').map((u: any) => ({
        id: u.id,
        email: u.email || "",
        name: u.name || "",
        role: u.role || "user",
        status: u.status || "active",
        createdAt: u.createdAt || new Date().toISOString(),
        websites: u.websites || [],
        ranking: u.ranking || "customer",
        phone: u.phone
      }));
      
      // Fetch Supabase users asynchronously (will be used on next render)
      (async () => {
        try {
          // First get profiles
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*");
          
          if (profiles && profiles.length > 0) {
            // Then fetch each user's email from auth.users via admin API or using the current session
            const usersWithEmails = await Promise.all(profiles.map(async (profile) => {
              try {
                // Try to get user email from auth meta
                const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
                return {
                  id: profile.id,
                  email: authUser?.user?.email || profile.id, // Fallback to ID if no email found
                  name: profile.name || "",
                  role: (profile.role as "user" | "admin") || "user",
                  status: (profile.status as "active" | "inactive") || "active",
                  createdAt: profile.created_at || new Date().toISOString(),
                  websites: [],
                  ranking: profile.ranking || "customer",
                  phone: profile.phone
                };
              } catch (error) {
                // If admin API fails, check if this is the current user and use their email
                if (session?.user && profile.id === session.user.id) {
                  return {
                    id: profile.id,
                    email: session.user.email || profile.id,
                    name: profile.name || "",
                    role: (profile.role as "user" | "admin") || "user",
                    status: (profile.status as "active" | "inactive") || "active",
                    createdAt: profile.created_at || new Date().toISOString(),
                    websites: [],
                    ranking: profile.ranking || "customer",
                    phone: profile.phone
                  };
                }
                
                // Otherwise use the ID as email (fallback)
                return {
                  id: profile.id,
                  email: profile.id, // Using ID as placeholder
                  name: profile.name || "",
                  role: (profile.role as "user" | "admin") || "user",
                  status: (profile.status as "active" | "inactive") || "active",
                  createdAt: profile.created_at || new Date().toISOString(),
                  websites: [],
                  ranking: profile.ranking || "customer",
                  phone: profile.phone
                };
              }
            }));
            
            localStorage.setItem('users', JSON.stringify(usersWithEmails));
            return usersWithEmails;
          }
          
          return localUsers;
        } catch (error) {
          console.error("Error fetching users from Supabase:", error);
          return localUsers;
        }
      })();
      
      return localUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Delete user function
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Try deleting using admin API if available
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter((u: any) => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      
      // Fallback to localStorage
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter((u: any) => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  // Update user status function
  const updateUserStatus = async (userId: string, newStatus: string): Promise<boolean> => {
    try {
      // Try updating with Supabase
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);
        
      if (error) {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        
        if (userIndex !== -1) {
          users[userIndex].status = newStatus;
          localStorage.setItem('users', JSON.stringify(users));
          return true;
        }
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      
      // Fallback to localStorage
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        
        if (userIndex !== -1) {
          users[userIndex].status = newStatus;
          localStorage.setItem('users', JSON.stringify(users));
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  };

  // Update user function
  const updateUser = async (userId: string, userData: Partial<User>, newPassword?: string): Promise<boolean> => {
    try {
      // Try updating with Supabase
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: userData.name,
          role: userData.role,
          status: userData.status,
          ranking: userData.ranking
        })
        .eq("id", userId);
        
      // Update password if provided
      if (newPassword) {
        // Can only update current user's password
        if (userId === user?.id) {
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (error) throw error;
        } else {
          // For other users, would need admin API which may not be available
          // Fallback to localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === userId);
          
          if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      }
      
      if (profileError) {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        
        if (userIndex === -1) {
          toast.error("User not found!");
          return false;
        }
        
        // Update user data
        const updatedUser = {
          ...users[userIndex],
          ...userData,
        };
        
        // Update password if provided
        if (newPassword) {
          updatedUser.password = newPassword;
        }
        
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // If current user is being updated, update the user in state
      if (user && user.id === userId) {
        const currentUserObj = {
          ...user,
          ...userData,
        };
        setUser(currentUserObj);
        localStorage.setItem('user', JSON.stringify(currentUserObj));
      }
      
      toast.success("User updated successfully!");
      return true;
    } catch (error) {
      console.error("User update error:", error);
      
      // Fallback to localStorage
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        
        if (userIndex === -1) {
          toast.error("User not found!");
          return false;
        }
        
        // Update user data
        const updatedUser = {
          ...users[userIndex],
          ...userData,
        };
        
        // Update password if provided
        if (newPassword) {
          updatedUser.password = newPassword;
        }
        
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        
        // If current user is being updated, update the user in state
        if (user && user.id === userId) {
          const currentUserObj = {
            ...user,
            ...userData,
          };
          setUser(currentUserObj);
          localStorage.setItem('user', JSON.stringify(currentUserObj));
        }
        
        toast.success("User updated successfully!");
        return true;
      } catch (e) {
        toast.error("Failed to update user!");
        return false;
      }
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
