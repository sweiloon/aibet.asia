
import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

// Get all users
export const getAllUsersUtil = (): User[] => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name || "",
      role: u.role || "user",
      status: u.status || "active",
      createdAt: u.createdAt || new Date().toISOString(),
      websites: u.websites || [],
      ranking: u.ranking || "customer", // Default to customer
      phone: u.phone
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Delete user
export const deleteUserUtil = async (userId: string): Promise<boolean> => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter((u: any) => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

// Update user status
export const updateUserStatusUtil = async (userId: string, newStatus: string): Promise<boolean> => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].status = newStatus;
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating user status:", error);
    return false;
  }
};

// Update user
export const updateUserUtil = async (
  userId: string, 
  userData: Partial<User>, 
  newPassword?: string,
  currentUser?: User | null
): Promise<boolean> => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      toast.error("User not found!");
      return false;
    }
    
    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...userData,
    };
    
    // Update password if provided
    if (newPassword) {
      updatedUser.password = newPassword;
    }
    
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    
    toast.success("User updated successfully!");
    return true;
  } catch (error) {
    console.error("User update error:", error);
    toast.error("Failed to update user!");
    return false;
  }
};
