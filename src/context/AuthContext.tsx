
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

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

// Default admin credentials
const ADMIN_EMAIL = "admin@aibet.asia";
const ADMIN_PASSWORD = "11111111";

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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Mock login function
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      // Add domain suffix if not present
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }

      // Admin login check
      if (isAdmin) {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser = { id: "admin1", email: ADMIN_EMAIL, role: "admin" as const };
          setUser(adminUser);
          localStorage.setItem('user', JSON.stringify(adminUser));
          toast.success("Admin login successful!");
          return true;
        } else {
          toast.error("Invalid admin credentials!");
          return false;
        }
      }
      
      // User login (mock - in real app would check against database)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const matchedUser = users.find((u: any) => u.email === email);
      
      if (matchedUser && matchedUser.password === password) {
        const userObj = { id: matchedUser.id, email: matchedUser.email, role: "user" as const };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Invalid credentials!");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Mock signup function
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
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        toast.error("Account already exists with this email!");
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user${Date.now()}`,
        email,
        password,
        phone,
        name,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login after signup
      const userObj = { id: newUser.id, email: newUser.email, role: "user" as const };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      toast.success("Account created successfully!");
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
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
  };
  
  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      if (user.role === "admin") {
        // Admin password change
        if (currentPassword !== ADMIN_PASSWORD) {
          toast.error("Current password is incorrect!");
          return false;
        }
        // In a real app, you would update the admin password in a database
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
