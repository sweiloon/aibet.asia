
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  signup: (email: string, password: string, phone: string, name: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  changePassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Supabase auth listener
  useEffect(() => {
    // First set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile to get role info
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("email, role")
              .eq("id", currentSession.user.id)
              .single();
            
            if (profile) {
              setUser({
                id: currentSession.user.id,
                email: profile.email,
                role: profile.role as "user" | "admin",
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then get initial session
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, role")
          .eq("id", initialSession.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: initialSession.user.id,
            email: profile.email,
            role: profile.role as "user" | "admin",
          });
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Create admin account if it doesn't exist
  useEffect(() => {
    const createAdminAccount = async () => {
      const ADMIN_EMAIL = "admin@aibet.asia";
      const ADMIN_PASSWORD = "11111111";
      
      try {
        // Check if admin exists
        const { data: existingAdmin } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', ADMIN_EMAIL)
          .eq('role', 'admin')
          .maybeSingle();
          
        if (!existingAdmin) {
          // Create admin user in auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          });
          
          if (authError) {
            console.error("Error creating admin account:", authError);
            return;
          }
          
          if (authData.user) {
            // Update the role to admin
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', authData.user.id);
              
            console.log("Admin account created successfully");
          }
        }
      } catch (error) {
        console.error("Error setting up admin account:", error);
      }
    };
    
    // Wait for the initial auth check to complete before creating admin
    if (!loading) {
      createAdminAccount();
    }
  }, [loading]);
  
  // Login function
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        toast.error(authError.message || "Invalid credentials");
        return false;
      }
      
      if (!authData.user) {
        toast.error("Invalid credentials");
        return false;
      }
      
      // Get user profile to check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();
      
      // Verify admin access if attempting admin login
      if (isAdmin && (!profile || profile.role !== "admin")) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        toast.error("Invalid admin credentials");
        return false;
      }
      
      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function
  const signup = async (email: string, password: string, phone: string, name: string): Promise<boolean> => {
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
      
      // Create user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone,
            name,
          }
        }
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Account already exists with this email!");
        } else {
          toast.error(error.message || "Signup failed");
        }
        return false;
      }
      
      if (!data.user) {
        toast.error("Signup failed");
        return false;
      }
      
      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
  };
  
  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // First verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (verifyError) {
        toast.error("Current password is incorrect!");
        return false;
      }
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        toast.error(updateError.message || "Failed to change password");
        return false;
      }
      
      toast.success("Password updated successfully!");
      return true;
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error("Failed to change password");
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
