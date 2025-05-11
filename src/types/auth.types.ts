
export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  signup: (email: string, password: string, phone: string, name: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
}
