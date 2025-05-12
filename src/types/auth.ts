
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  createdAt?: string;
  websites?: any[];
  ranking?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  signup: (email: string, password: string, phone: string, name: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
  getAllUsers: () => User[];
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string, newStatus: string) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>, newPassword?: string) => Promise<boolean>;
}
