
import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

// Default admin credentials
export const ADMIN_EMAIL = "admin@aibet.asia";
export const ADMIN_PASSWORD = "admin123";

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

// Login function
export const loginUtil = async (
  email: string, 
  password: string, 
  isAdmin: boolean
): Promise<{ success: boolean; user: User | null }> => {
  try {
    // Add domain suffix if not present
    if (!email.includes("@")) {
      email = `${email}@aibet.asia`;
    }

    // Admin login check
    if (isAdmin) {
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
    }
    
    // User login (mock - in real app would check against database)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = users.find((u: any) => u.email === email);
    
    if (matchedUser && matchedUser.password === password) {
      const userObj = { 
        id: matchedUser.id, 
        email: matchedUser.email, 
        role: matchedUser.role || "user" as const,
        ranking: matchedUser.ranking || "customer", // Ensure ranking is preserved
        name: matchedUser.name,
        phone: matchedUser.phone
      };
      toast.success("Login successful!");
      return { success: true, user: userObj };
    } else {
      toast.error("Invalid credentials!");
      return { success: false, user: null };
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed!");
    return { success: false, user: null };
  }
};

// Signup function
export const signupUtil = async (
  email: string, 
  password: string, 
  phone: string, 
  name: string, 
  isAdmin = false
): Promise<{ success: boolean; user: User | null }> => {
  try {
    // Add domain suffix if not present
    if (!email.includes("@")) {
      email = `${email}@aibet.asia`;
    }
    
    // Validate phone number (must start with +60 followed by 1-9)
    const phonePattern = /^\+60[1-9]/;
    if (!phonePattern.test(phone)) {
      toast.error("Phone number must start with +60 followed by a digit from 1-9");
      return { success: false, user: null };
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.email === email)) {
      toast.error("Account already exists with this email!");
      return { success: false, user: null };
    }
    
    // Check if phone number already exists
    if (users.some((u: any) => u.phone === phone)) {
      toast.error("This phone number has already been registered!");
      return { success: false, user: null };
    }
    
    // For admin signup, check if admin already exists
    if (isAdmin) {
      const adminExists = await checkAdminExistsUtil();
      if (adminExists) {
        toast.error("An admin account already exists!");
        return { success: false, user: null };
      }
    }
    
    // Create new user
    const newUser = {
      id: `user${Date.now()}`,
      email,
      password,
      phone,
      name,
      role: isAdmin ? "admin" : "user",
      createdAt: new Date().toISOString(),
      ranking: "customer" // Set default ranking
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create user object for return
    const userObj = { 
      id: newUser.id, 
      email: newUser.email, 
      role: isAdmin ? "admin" as const : "user" as const,
      ranking: "customer", // Set default ranking
      name: newUser.name,
      phone: newUser.phone
    };
    
    toast.success(isAdmin ? "Admin account created successfully!" : "Account created successfully!");
    return { success: true, user: userObj };
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Signup failed!");
    return { success: false, user: null };
  }
};

// Change password function
export const changePasswordUtil = async (
  user: User | null,
  currentPassword: string, 
  newPassword: string
): Promise<boolean> => {
  if (!user) return false;
  
  try {
    if (user.role === "admin") {
      // Admin password change
      if (user.email === ADMIN_EMAIL && currentPassword !== ADMIN_PASSWORD) {
        toast.error("Current password is incorrect!");
        return false;
      }
      
      // Check for custom admin account
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === user.email);
      
      if (userIndex !== -1) {
        if (users[userIndex].password !== currentPassword) {
          toast.error("Current password is incorrect!");
          return false;
        }
        
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        toast.success("Password updated successfully!");
        return true;
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
