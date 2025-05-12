
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types/auth";
import { useAuthUtils } from "@/hooks/useAuthUtils";
import { toast } from "@/components/ui/sonner";

// Re-export User type for backward compatibility
export type { User };

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
  const [loading, setLoading] = useState(true);
  const { 
    loginUtil, 
    signupUtil, 
    changePasswordUtil, 
    checkAdminExistsUtil, 
    getAllUsersUtil,
    deleteUserUtil,
    updateUserStatusUtil,
    updateUserUtil
  } = useAuthUtils();
  
  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Check if admin exists
  const checkAdminExists = async (): Promise<boolean> => {
    return await checkAdminExistsUtil();
  };
  
  // Login function
  const login = async (email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await loginUtil(email, password, isAdmin);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      return result.success;
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function
  const signup = async (email: string, password: string, phone: string, name: string, isAdmin = false): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await signupUtil(email, password, phone, name, isAdmin);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      return result.success;
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
    return await changePasswordUtil(user, currentPassword, newPassword);
  };

  // Get all users function
  const getAllUsers = (): User[] => {
    return getAllUsersUtil();
  };

  // Delete user function
  const deleteUser = async (userId: string): Promise<boolean> => {
    return await deleteUserUtil(userId);
  };

  // Update user status function
  const updateUserStatus = async (userId: string, newStatus: string): Promise<boolean> => {
    return await updateUserStatusUtil(userId, newStatus);
  };

  // Update user function
  const updateUser = async (userId: string, userData: Partial<User>, newPassword?: string): Promise<boolean> => {
    const result = await updateUserUtil(userId, userData, newPassword, user);
    
    // If current user is being updated, update the user in state and localStorage
    if (user && user.id === userId && result) {
      const currentUserObj = {
        ...user,
        ...userData,
      };
      setUser(currentUserObj);
      localStorage.setItem('user', JSON.stringify(currentUserObj));
    }
    
    return result;
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
