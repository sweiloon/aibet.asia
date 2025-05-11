
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const authService = {
  // Check if admin exists
  checkAdminExists: async (): Promise<boolean> => {
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
  },
  
  // Login function
  login: async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
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
    }
  },
  
  // Signup function
  signup: async (
    email: string, 
    password: string, 
    phone: string, 
    name: string, 
    isAdmin = false
  ): Promise<boolean> => {
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
        const adminExists = await authService.checkAdminExists();
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
    }
  },
  
  // Logout function
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out successfully");
    }
  },
  
  // Change password function
  changePassword: async (currentPassword: string, newPassword: string, userEmail: string): Promise<boolean> => {
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
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
  }
};
