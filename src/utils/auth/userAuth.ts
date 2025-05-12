
import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

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
      const { checkAdminLogin } = require("./adminUtils");
      return checkAdminLogin(email, password);
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
    
    const { validatePhoneNumber } = require("./validation");
    if (!validatePhoneNumber(phone)) {
      toast.error("Invalid phone number format!");
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
      const { checkAdminExistsUtil } = require("./adminUtils");
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
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = require("./constants");
    
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
