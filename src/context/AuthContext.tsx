
import { createContext, useContext, ReactNode } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { authService } from "@/services/authService";
import { AuthContextType, User } from "@/types/auth.types";

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
  const { user, loading, setLoading } = useSupabaseAuth();
  
  // Login function wrapper
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    const result = await authService.login(email, password, isAdmin);
    setLoading(false);
    return result;
  };
  
  // Signup function wrapper
  const signup = async (
    email: string, 
    password: string, 
    phone: string, 
    name: string, 
    isAdmin = false
  ): Promise<boolean> => {
    setLoading(true);
    const result = await authService.signup(email, password, phone, name, isAdmin);
    setLoading(false);
    return result;
  };
  
  // Change password wrapper
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user || !user.email) return false;
    return authService.changePassword(currentPassword, newPassword, user.email);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout: authService.logout, 
      changePassword,
      checkAdminExists: authService.checkAdminExists
    }}>
      {children}
    </AuthContext.Provider>
  );
};
