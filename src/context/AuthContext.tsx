
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  signup: (email: string, password: string, phone: string, name: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  changePassword: async () => false,
  checkAdminExists: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // Initialize auth state from Supabase
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        // Update user state after session change
        if (currentSession?.user) {
          // Fetch user profile to get the role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              role: profile.role as "user" | "admin"
            });
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Fetch user profile to get role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            role: profile.role as "user" | "admin"
          });
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Check if admin exists
  const checkAdminExists = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('admin_created')
        .single();
      
      if (error) {
        console.error("Error checking admin existence:", error);
        return false;
      }
      
      return data?.admin_created || false;
    } catch (error) {
      console.error("Error checking admin existence:", error);
      return false;
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

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message || "Login failed");
        return false;
      }
      
      // Check if user has the correct role
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (!profile) {
          toast.error("User profile not found");
          await supabase.auth.signOut();
          return false;
        }
        
        // Verify correct role based on login type
        if (isAdmin && profile.role !== 'admin') {
          toast.error("Invalid admin credentials");
          await supabase.auth.signOut();
          return false;
        } else if (!isAdmin && profile.role !== 'user') {
          toast.error("Please use the admin login");
          await supabase.auth.signOut();
          return false;
        }
        
        toast.success("Login successful!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    phone: string, 
    name: string, 
    isAdmin = false
  ): Promise<boolean> => {
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
            role: isAdmin ? 'admin' : 'user'
          }
        }
      });
      
      if (error) {
        toast.error(error.message || "Signup failed");
        return false;
      }
      
      // The profile is created automatically via the database trigger
      toast.success(isAdmin ? "Admin account created successfully!" : "Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      setUser(null);
      toast.success("Logged out successfully");
    }
  };
  
  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        toast.error("Current password is incorrect");
        return false;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error(error.message || "Failed to change password");
        return false;
      }
      
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password");
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, changePassword, checkAdminExists }}>
      {children}
    </AuthContext.Provider>
  );
};
