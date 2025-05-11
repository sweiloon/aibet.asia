
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
      (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        setSession(session);
        
        if (session?.user) {
          // Using setTimeout to avoid potential deadlock with auth state change
          setTimeout(async () => {
            try {
              console.log("Auth change: fetching profile for user:", session.user.id);
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
              
              console.log("Profile data fetched:", data);
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: data.role as "user" | "admin"
              });
            } catch (error) {
              console.error("Error setting user:", error);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );
    
    // Then check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      
      if (session?.user) {
        try {
          console.log("Getting profile for user:", session.user.id);
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user role:", error);
            setUser(null);
            setLoading(false);
            return;
          }
          
          console.log("Initial profile data:", data);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: data.role as "user" | "admin"
          });
        } catch (error) {
          console.error("Error setting initial user:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login function
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    console.log("Attempting login for:", email, "as admin:", isAdmin);
    
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
        console.error("Auth error:", authError);
        toast.error(authError.message);
        setLoading(false);
        return false;
      }
      
      if (!authData.user) {
        console.error("No user returned from auth");
        toast.error("Invalid credentials");
        setLoading(false);
        return false;
      }
      
      console.log("Auth successful, checking profile");
      
      // Check if the user has the correct role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        console.error("Profile error:", profileError);
        toast.error("Error fetching user profile");
        // Sign out if profile check fails
        await supabase.auth.signOut();
        setLoading(false);
        return false;
      }
      
      // Verify the role matches the login type
      console.log("Profile found:", profile, "expecting admin:", isAdmin);
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
        setLoading(false);
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
        setLoading(false);
        return false;
      }
      
      if (data.user) {
        toast.success("Account created successfully!");
        setLoading(false);
        return true;
      } else {
        toast.error("Failed to create account");
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed!");
      setLoading(false);
      return false;
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
