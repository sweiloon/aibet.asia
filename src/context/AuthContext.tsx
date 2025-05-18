import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabaseClient";
import {
  PostgrestResponse,
  SupabaseClient,
  PostgrestError,
} from "@supabase/supabase-js";

export type ProfileStatusType =
  | "idle"
  | "loading_full"
  | "partial_fallback"
  | "loaded_full"
  | "loaded_full_stale"
  | "failed_fetch";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  createdAt?: string;
  ranking?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileStatus: ProfileStatusType;
  login: (
    email: string,
    password: string,
    isAdmin: boolean
  ) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    phone: string,
    name: string,
    isAdmin?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserStatus: (userId: string, newStatus: string) => Promise<boolean>;
  updateUser: (
    userId: string,
    userData: Partial<User>,
    newPassword?: string
  ) => Promise<boolean>;
  adminStateVersion: number;
  bumpAdminStateVersion: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profileStatus: "idle",
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  changePassword: async () => false,
  checkAdminExists: async () => false,
  getAllUsers: async () => [],
  deleteUser: async () => false,
  updateUserStatus: async () => false,
  updateUser: async () => false,
  adminStateVersion: 0,
  bumpAdminStateVersion: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Function to create a promise that rejects after a timeout
const withTimeout = <T,>(
  promise: Promise<T>,
  ms: number,
  timeoutError = new Error("Promise timed out")
) => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError);
    }, ms);
  });
  return Promise.race<T>([promise, timeout]);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<ProfileStatusType>("idle");
  const [adminStateVersion, setAdminStateVersion] = useState(0);
  const bumpAdminStateVersion = () => setAdminStateVersion((v) => v + 1);
  const isInitialProfileLoadAttempt = useRef(true);
  const profileStatusRef = useRef<ProfileStatusType>(profileStatus);

  useEffect(() => {
    profileStatusRef.current = profileStatus;
    console.log(
      "AUTH_CONTEXT: profileStatusRef updated to:",
      profileStatusRef.current
    );
  }, [profileStatus]);

  const fetchUserProfile = async (
    userId: string,
    retryCount = 0
  ): Promise<User | null> => {
    console.log(
      `AUTH_CONTEXT: fetchUserProfile START - User ID: ${userId}, Attempt: ${
        retryCount + 1
      }`
    );
    try {
      console.log(
        `AUTH_CONTEXT: fetchUserProfile - Attempting Supabase query (with timeout) for user ID: ${userId}`
      );

      type ExpectedSupabaseResponse = PostgrestResponse<User[]>;

      const supabaseQueryAsPromise = new Promise<ExpectedSupabaseResponse>(
        (resolve, reject) => {
          supabase
            .from("users")
            .select("id, email, name, role, ranking, status, createdat, phone")
            .eq("id", userId)
            .then(
              (response) => {
                console.log("fetchUserProfile Supabase response:", response);
                if (response.error) {
                  console.warn(
                    "AUTH_CONTEXT: fetchUserProfile - Inside Promise .then() - Supabase response included an error:",
                    response.error
                  );
                  reject(response.error);
                } else {
                  resolve(response as ExpectedSupabaseResponse);
                }
              },
              (error) => {
                console.error(
                  "AUTH_CONTEXT: fetchUserProfile - Inside Promise .then()'s second arg (reject) - Supabase client chain error:",
                  error
                );
                reject(error);
              }
            );
        }
      );

      console.log(
        "AUTH_CONTEXT: fetchUserProfile - Supabase query wrapped in Promise. Applying timeout (3s)."
      );
      console.log(
        "AUTH_CONTEXT: fetchUserProfile - ABOUT TO AWAIT withTimeout for supabaseQueryAsPromise."
      );

      const queryResult: ExpectedSupabaseResponse = await withTimeout(
        supabaseQueryAsPromise,
        3000,
        new Error(
          `Supabase query timed out after 3 seconds for user ID: ${userId}`
        )
      );

      console.log(
        "AUTH_CONTEXT: fetchUserProfile - AWAIT withTimeout COMPLETED."
      );

      const { data, error, status, statusText } = queryResult;

      console.log(
        `AUTH_CONTEXT: fetchUserProfile - Supabase query completed. Status: ${status}, StatusText: ${statusText}`
      );
      console.log(
        "AUTH_CONTEXT: fetchUserProfile - Supabase response data:",
        data
      );
      console.log(
        "AUTH_CONTEXT: fetchUserProfile - Supabase response error:",
        error
      );

      if (error) {
        console.error(
          `AUTH_CONTEXT: fetchUserProfile - Error object in Supabase response. Message: ${error.message}, Details:`,
          error
        );
        if (
          retryCount < 1 &&
          !(error.message && error.message.includes("timed out"))
        ) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(
            `AUTH_CONTEXT: fetchUserProfile - Retrying due to Supabase error in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchUserProfile(userId, retryCount + 1);
        }
        toast.error(
          error.message || "Failed to load user profile due to Supabase error."
        );
        return null;
      }

      if (Array.isArray(data) && data.length === 1) {
        console.log(
          `AUTH_CONTEXT: fetchUserProfile SUCCESS - Profile data found for user ID: ${userId}`,
          data[0]
        );
        const userData = data[0] as unknown as Record<string, unknown>;
        return {
          ...userData,
          createdAt: userData.createdat,
        } as User;
      } else if (Array.isArray(data) && data.length === 0) {
        console.warn(
          `AUTH_CONTEXT: fetchUserProfile - No user found for ID: ${userId}.`
        );
        return null;
      } else if (data === null) {
        console.warn(
          `AUTH_CONTEXT: fetchUserProfile - Data is null for user ID: ${userId}. (RLS or no record?)`
        );
        return null;
      } else {
        console.warn(
          `AUTH_CONTEXT: fetchUserProfile - Unexpected data format for ID: ${userId}. Data:`,
          data
        );
        return null;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("timed out")) {
        console.error(
          `AUTH_CONTEXT: fetchUserProfile - Supabase query TIMED OUT for user ID: ${userId}. Error:`,
          err
        );
      } else if (err && typeof err === "object" && "message" in err) {
        const anError = err as PostgrestError;
        console.error(
          `AUTH_CONTEXT: fetchUserProfile - Caught error object. User ID: ${userId}. Message: ${anError.message}, Details:`,
          anError
        );
        toast.error(anError.message || "A database error occurred.");
      } else if (err instanceof Error) {
        console.error(
          `AUTH_CONTEXT: fetchUserProfile - Caught generic Error. User ID: ${userId}. Message: ${err.message}`
        );
        toast.error(
          "An unexpected error occurred while fetching user profile."
        );
      } else {
        console.error(
          `AUTH_CONTEXT: fetchUserProfile - Caught non-Error exception. User ID: ${userId}. Details:`,
          err
        );
        toast.error("An unknown issue occurred while fetching user profile.");
      }
      return null;
    } finally {
      console.log(
        `AUTH_CONTEXT: fetchUserProfile FINALLY - User ID: ${userId}, Attempt: ${
          retryCount + 1
        }`
      );
    }
  };

  // Check if admin exists in users table
  const checkAdminExists = async (): Promise<boolean> => {
    console.log("AUTH_CONTEXT: checkAdminExists - Checking...");
    try {
      const { error, count } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .ilike("role", "admin");

      if (error) {
        console.error(
          "AUTH_CONTEXT: checkAdminExists - Error checking admin existence:",
          error
        );
        return true; // Default to true (button hidden, safer) on error to prevent accidental admin creation page access
      }
      console.log(
        "AUTH_CONTEXT: checkAdminExists - Count of admins found:",
        count
      );
      return count !== null && count > 0;
    } catch (err) {
      console.error("AUTH_CONTEXT: checkAdminExists - Unexpected error:", err);
      return true; // Default to true (button hidden, safer) on error
    }
  };

  // Handle auth state changes - This useEffect is now the primary driver for session initialization
  useEffect(() => {
    console.log(
      "AUTH_CONTEXT: useEffect - Registering onAuthStateChange listener."
    );
    setLoading(true);

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log(
          `AUTH_CONTEXT: onAuthStateChange - Event: ${_event}, Session User: ${
            session?.user?.email || "None"
          }`
        );
        if (session?.user) {
          setProfileStatus("loading_full");

          const wasInitialAttempt = isInitialProfileLoadAttempt.current;
          if (wasInitialAttempt) {
            isInitialProfileLoadAttempt.current = false;
          }

          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            console.log(
              `AUTH_CONTEXT: onAuthStateChange - Profile for ${profile.email} loaded successfully on event ${_event}.`
            );
            setUser(profile);
            setProfileStatus("loaded_full");
          } else {
            console.warn(
              `AUTH_CONTEXT: onAuthStateChange - Profile fetch failed or returned null for user ${session.user.id} on event ${_event}.`
            );

            if (profileStatus === "loaded_full") {
              console.warn(
                `AUTH_CONTEXT: Failed to refresh full profile for ${
                  user?.email || session.user.id
                }. Retaining stale data.`
              );
              setProfileStatus("loaded_full_stale");
              toast.warning(
                "Couldn't refresh all data. Displaying last known information. Try refreshing later."
              );
            } else {
              console.warn(
                `AUTH_CONTEXT: Initial/critical profile fetch failed for ${session.user.email}. Setting minimal user.`
              );
              setUser({
                id: session.user.id,
                email: session.user.email as string,
                role:
                  (session.user.app_metadata?.userrole as User["role"]) ||
                  "user",
              });
              setProfileStatus("partial_fallback");
              if (!wasInitialAttempt) {
                toast.warning(
                  "Could not load all profile details. Some features might be limited. You can try refreshing."
                );
              }
            }
          }
        } else {
          console.log(
            "AUTH_CONTEXT: onAuthStateChange - No session or user signed out. Clearing user state."
          );
          setUser(null);
          setProfileStatus("idle");
        }
        setLoading(false);
      }
    );

    return () => {
      console.log("AUTH_CONTEXT: useEffect cleanup - Unsubscribing.");
      if (listener && listener.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchUserProfile(user.id).then((profile) => {
      if (profile) setUser(profile);
    });
  }, [user?.id]);

  // Login with Supabase Auth
  const login = async (
    email: string,
    password: string,
    isAdmin: boolean
  ): Promise<boolean> => {
    console.log("AUTH_CONTEXT: login START");
    setLoading(true);
    try {
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        console.error("AUTH_CONTEXT: login - signInError:", signInError);
        toast.error(signInError.message || "Invalid credentials");
        setUser(null);
        return false;
      }

      if (!signInData || !signInData.user) {
        console.error(
          "AUTH_CONTEXT: login - No user data after signInWithPassword"
        );
        toast.error("Login failed: No user data returned.");
        setUser(null);
        return false;
      }

      console.log(
        `AUTH_CONTEXT: login - signInWithPassword successful for ${signInData.user.email}. Fetching profile.`
      );
      const profile = await fetchUserProfile(signInData.user.id);
      if (profile) {
        setUser(profile);
        toast.success("Login successful!");
        setLoading(false);
        return true;
      } else {
        console.error(
          `AUTH_CONTEXT: login - Profile not found for ${signInData.user.email} after login.`
        );
        toast.error("Login successful, but profile could not be loaded.");
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("AUTH_CONTEXT: login - Unexpected error:", error);
      toast.error("Login failed due to an unexpected error.");
      setUser(null);
      return false;
    }
  };

  // Signup with Supabase Auth and insert profile
  const signup = async (
    email: string,
    password: string,
    phone: string,
    name: string,
    isAdmin = false
  ): Promise<boolean> => {
    console.log("AUTH_CONTEXT: signup START");
    setLoading(true);
    try {
      if (!email.includes("@")) {
        email = `${email}@aibet.asia`;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        toast.error("Valid email required.");
        setLoading(false);
        return false;
      }
      if (password.length < 6) {
        toast.error("Password min 6 chars.");
        setLoading(false);
        return false;
      }

      const { data: signUpAuthData, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

      if (signUpError) {
        console.error("AUTH_CONTEXT: signup - auth.signUp Error:", signUpError);
        toast.error(signUpError.message || "Signup failed at auth stage!");
        setLoading(false);
        return false;
      }
      if (!signUpAuthData.user) {
        console.error("AUTH_CONTEXT: signup - No user data from auth.signUp!");
        toast.error("Signup auth successful, but no user data returned!");
        setLoading(false);
        return false;
      }
      console.log(
        `AUTH_CONTEXT: signup - Supabase auth.signUp successful for ${signUpAuthData.user.email}. User ID: ${signUpAuthData.user.id}`
      );

      const userProfileData = {
        id: signUpAuthData.user.id,
        email: email.trim(),
        name,
        phone,
        role: isAdmin ? "admin" : "user",
        status: "active",
        ranking: "customer",
      };

      console.log("AUTH_CONTEXT: signup - Inserting profile:", userProfileData);
      const { data: insertedProfile, error: profileError } = await supabase
        .from("users")
        .insert([userProfileData])
        .select()
        .single();

      if (profileError) {
        console.error(
          "AUTH_CONTEXT: signup - Profile creation DB error:",
          profileError
        );
        toast.error(
          profileError.message || "Failed to create user profile in DB!"
        );
        setLoading(false);
        return false;
      }

      if (!insertedProfile) {
        console.error(
          "AUTH_CONTEXT: signup - Profile not returned after insert, possibly RLS issue or other DB constraint."
        );
        toast.error(
          "Account created, but profile could not be confirmed. Please try logging in."
        );
        setLoading(false);
        return false;
      }

      console.log(
        "AUTH_CONTEXT: signup - Profile inserted successfully for:",
        insertedProfile.email
      );
      setUser(insertedProfile as User);
      bumpAdminStateVersion();
      toast.success("Account created successfully!");
      setLoading(false);
      return true;
    } catch (error: unknown) {
      console.error("AUTH_CONTEXT: signup - Unexpected error:", error);
      toast.error("Signup failed due to an unexpected error.");
      setLoading(false);
      return false;
    }
  };

  // Logout with Supabase Auth
  const logout = async () => {
    console.log("AUTH_CONTEXT: logout START");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AUTH_CONTEXT: logout - Error:", error);
        toast.error("Logout failed. Please try again.");
      } else {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("AUTH_CONTEXT: logout - Unexpected error:", error);
      toast.error("Logout failed unexpectedly.");
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!user?.email) {
      toast.error("User not authenticated. Please re-login.");
      return false;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message || "Failed to update password.");
        return false;
      }
      toast.success(
        "Password updated successfully! You may need to log in again with your new password if the session is terminated."
      );
      return true;
    } catch (err) {
      console.error("Unexpected password change error:", err);
      toast.error("Failed to update password due to an unexpected error.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get all users (admin only)
  const getAllUsers = useCallback(async (): Promise<User[]> => {
    if (user?.role !== "admin") {
      toast.error("Permission denied.");
      return [];
    }
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
        return [];
      }
      // Map 'createdat' from Supabase to 'createdAt' in User object
      return (data || []).map((u: Record<string, unknown>) => ({
        id: u.id as string,
        email: u.email as string,
        name: u.name as string | undefined,
        role: u.role as "user" | "admin",
        status: u.status as "active" | "inactive" | undefined,
        createdAt: u.createdat as string,
        ranking: u.ranking as string | undefined,
        phone: u.phone as string | undefined,
      }));
    } catch (err) {
      console.error("Unexpected error in getAllUsers:", err);
      toast.error("An unexpected error occurred while fetching users.");
      return [];
    }
  }, [user, toast]);

  // Delete user (admin only)
  const deleteUser = async (userId: string): Promise<boolean> => {
    if (user?.role !== "admin") {
      toast.error("Permission denied.");
      return false;
    }
    setLoading(true);
    try {
      console.warn(
        "deleteUser currently only removes from 'users' table, not Supabase Auth. Implement server-side logic for full deletion."
      );
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (error) {
        console.error("Error deleting user from DB:", error);
        toast.error("Failed to delete user data.");
        return false;
      }
      toast.success("User data deleted from database.");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteUser:", err);
      toast.error("An unexpected error occurred while deleting user.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update user status (admin only)
  const updateUserStatus = async (
    userId: string,
    newStatus: string
  ): Promise<boolean> => {
    if (user?.role !== "admin") {
      toast.error("Permission denied.");
      return false;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", userId);
      if (error) {
        console.error("Error updating user status:", error);
        toast.error("Failed to update user status.");
        return false;
      }
      toast.success("User status updated.");
      setUser((prevUser) =>
        prevUser && prevUser.id === userId
          ? { ...prevUser, status: newStatus as User["status"] }
          : prevUser
      );
      return true;
    } catch (err) {
      console.error("Unexpected error in updateUserStatus:", err);
      toast.error("An unexpected error occurred while updating user status.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile (admin or self)
  const updateUser = async (
    userId: string,
    userData: Partial<User>,
    newPassword?: string
  ): Promise<boolean> => {
    if (user?.role !== "admin" && user?.id !== userId) {
      toast.error("Permission denied.");
      return false;
    }
    setLoading(true);
    try {
      if (userData.role && user?.role !== "admin") {
        delete userData.role;
        console.warn("Attempt to change user role by non-admin was prevented.");
      }

      const { error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", userId);

      if (error) {
        console.error("Error updating user profile in DB:", error);
        toast.error("Failed to update user profile.");
        return false;
      }
      // If admin is changing the email, also update in Supabase Auth
      if (user?.role === "admin" && userData.email) {
        try {
          const response = await fetch(
            "https://apregqsbuchlaflxrv.functions.supabase.co/admin-update-user-email-v2",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, newEmail: userData.email }),
            }
          );
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || "Failed to update email in Auth");
          }
        } catch (err) {
          console.error("Failed to update email in Supabase Auth:", err);
          toast.error(
            "Email updated in profile, but failed in Auth. User may need to contact support."
          );
        }
      }
      toast.success("User profile updated.");
      if (user?.id === userId) {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
      }
      return true;
    } catch (err) {
      console.error("Unexpected error in updateUser:", err);
      toast.error("An unexpected error occurred while updating user profile.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Effect for handling tab visibility changes to auto-refresh if needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log(
          "AUTH_CONTEXT: visibilitychange (visible) - current handler sees profileStatus via ref:",
          profileStatusRef.current
        );

        if (
          profileStatusRef.current === "partial_fallback" ||
          profileStatusRef.current === "loaded_full_stale"
        ) {
          console.log(
            `AUTH_CONTEXT: Profile is ${profileStatusRef.current} on tab focus (checked via ref), reloading page.`
          );
          window.location.reload();
        }
      }
    };

    console.log(
      "AUTH_CONTEXT: visibilitychange effect (mount) - registering listener."
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      console.log(
        "AUTH_CONTEXT: visibilitychange effect (unmount) - cleanup listener."
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array: runs only on mount and unmount

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profileStatus,
        login,
        signup,
        logout,
        changePassword,
        checkAdminExists,
        getAllUsers,
        deleteUser,
        updateUserStatus,
        updateUser,
        adminStateVersion,
        bumpAdminStateVersion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
