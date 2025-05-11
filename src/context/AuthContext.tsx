
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential recursive issues
          setTimeout(async () => {
            try {
              // Fetch the user's profile to get the role
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) throw error;
              
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                role: profile.role as "user" | "admin"
              });
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );
    
    // Then check for initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        // Fetch the user's role from profiles table
        supabase
          .from('profiles')
          .select('role')
          .eq('id', initialSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
              setLoading(false);
              return;
            }
            
            setUser({
              id: initialSession.user.id,
              email: initialSession.user.email || '',
              role: data.role as "user" | "admin"
            });
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
  
  // Login function that handles both user and admin logins
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message || "Login failed!");
        return false;
      }
      
      if (!data.user) {
        toast.error("Login failed: User not found");
        return false;
      }
      
      // Verify the role matches the login type (admin/user)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileError || !profile) {
        toast.error("Could not verify user role");
        await supabase.auth.signOut();
        return false;
      }
      
      // Check if the role matches the login type
      if ((isAdmin && profile.role !== 'admin') || (!isAdmin && profile.role === 'admin')) {
        toast.error(isAdmin 
          ? "Access denied: Admin credentials required" 
          : "Please use the admin login for administrator access");
        await supabase.auth.signOut();
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
  
  // Signup function for new users (only regular users, not admins)
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
      
      // Register the new user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          },
        }
      });
      
      if (error) {
        toast.error(error.message || "Signup failed!");
        return false;
      }
      
      if (!data.user) {
        toast.error("Signup failed: Could not create user");
        return false;
      }
      
      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed!");
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
    if (!session?.user) return false;
    
    try {
      // First verify the current password by trying to sign in
      const { error: verificationError } = await supabase.auth.signInWithPassword({
        email: session.user.email || '',
        password: currentPassword,
      });
      
      if (verificationError) {
        toast.error("Current password is incorrect!");
        return false;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error(error.message || "Failed to change password!");
        return false;
      }
      
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
