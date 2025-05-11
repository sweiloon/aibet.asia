
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            // Get user role from profiles
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (error) throw error;
            
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: (profile?.role as "user" | "admin") || "user"
            });
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: (profile?.role as "user" | "admin") || "user"
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login function
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user) {
        toast.error("Invalid credentials!");
        return false;
      }
      
      // Check if user has correct role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const userRole = profile?.role || "user";
      
      // Validate role matches login type
      if ((isAdmin && userRole !== "admin") || (!isAdmin && userRole === "admin")) {
        await supabase.auth.signOut();
        toast.error(isAdmin ? "Invalid admin credentials!" : "Please use the user login!");
        return false;
      }
      
      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed!");
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle user already exists error
      if (error.message?.includes("User already registered")) {
        toast.error("Account already exists with this email!");
      } else {
        toast.error(error.message || "Signup failed!");
      }
      
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
      // First verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error("Current password is incorrect!");
        return false;
      }
      
      // Now update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      toast.success("Password updated successfully!");
      return true;
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.message || "Failed to change password!");
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
