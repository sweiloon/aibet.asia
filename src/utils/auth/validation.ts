
import { toast } from "@/components/ui/sonner";

// Validate phone number format
export const validatePhoneNumber = (phone: string): boolean => {
  // Phone must start with +60 followed by a digit from 1-9
  const phonePattern = /^\+60[1-9]/;
  
  if (!phonePattern.test(phone)) {
    toast.error("Phone number must start with +60 followed by a digit from 1-9");
    return false;
  }
  
  return true;
};
