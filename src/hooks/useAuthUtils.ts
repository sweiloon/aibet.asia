
import { User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import { 
  loginUtil, 
  signupUtil, 
  changePasswordUtil, 
  checkAdminExistsUtil, 
  getAllUsersUtil,
  deleteUserUtil,
  updateUserStatusUtil,
  updateUserUtil 
} from "@/utils/authUtils";

export const useAuthUtils = () => {
  return {
    loginUtil,
    signupUtil,
    changePasswordUtil,
    checkAdminExistsUtil,
    getAllUsersUtil,
    deleteUserUtil,
    updateUserStatusUtil,
    updateUserUtil
  };
};
