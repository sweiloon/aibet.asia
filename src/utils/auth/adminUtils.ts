
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./constants";
import { toast } from "@/components/ui/sonner";

// Check if admin exists
export const checkAdminExistsUtil = async (): Promise<boolean> => {
  try {
    // In a real app, this would check the database for admin accounts
    // For this mock implementation, we'll check localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some((user: any) => user.role === "admin");
  } catch (error) {
    console.error("Error checking admin existence:", error);
    return false;
  }
};

// Admin login helper
export const checkAdminLogin = (email: string, password: string) => {
  // Check default admin credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminUser = { id: "admin1", email: ADMIN_EMAIL, role: "admin" as const };
    toast.success("Admin login successful!");
    return { success: true, user: adminUser };
  } else {
    // Check for custom admin accounts in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = users.find((u: any) => u.email === email && u.role === "admin");
    
    if (adminUser && adminUser.password === password) {
      const userObj = { 
        id: adminUser.id, 
        email: adminUser.email, 
        role: "admin" as const,
        ranking: adminUser.ranking || "customer" // Ensure ranking is preserved
      };
      toast.success("Admin login successful!");
      return { success: true, user: userObj };
    } else {
      toast.error("Invalid admin credentials!");
      return { success: false, user: null };
    }
  }
};
