
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

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
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  changePassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            // Fetch user role from profiles
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error("Error fetching user role:", error);
              setUser(null);
              return;
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: data.role as "user" | "admin"
            });
          } catch (error) {
            console.error("Error setting user:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch user role from profiles
        setTimeout(async () => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error("Error fetching user role:", error);
              setUser(null);
              return;
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: data.role as "user" | "admin"
            });
          } catch (error) {
            console.error("Error setting user:", error);
            setUser(null);
          }
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    
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
      
      // First authenticate the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return false;
      }
      
      if (!authData.user) {
        toast.error("Invalid credentials");
        setLoading(false);
        return false;
      }
      
      // Check if the user has the correct role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        toast.error("Error fetching user profile");
        // Sign out if profile check fails
        await supabase.auth.signOut();
        setLoading(false);
        return false;
      }
      
      // Verify the role matches the login type
      const userRole = profile.role;
      if ((isAdmin && userRole !== 'admin') || (!isAdmin && userRole !== 'user')) {
        toast.error(isAdmin 
          ? "This account doesn't have admin privileges. Please use the user login." 
          : "Admin accounts must use the admin login.");
        // Sign out if role doesn't match
        await supabase.auth.signOut();
        setLoading(false);
        return false;
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
            phone,
            name
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        toast.success("Account created successfully!");
        return true;
      } else {
        toast.error("Failed to create account");
        return false;
      }
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
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
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
        toast.error("Current password is incorrect!");
        return false;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success("Password updated successfully!");
      return true;
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password!");
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
