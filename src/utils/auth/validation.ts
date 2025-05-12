
// Validations
export const validatePhoneNumber = (phone: string): boolean => {
  // Must start with +60 followed by any number of digits (at least 1)
  const phonePattern = /^\+60\d+$/;
  
  // Test if the phone matches the pattern and is at least 10 characters long (+60 plus at least 8 digits)
  const isValid = phonePattern.test(phone) && phone.length >= 10;
  
  if (!isValid) {
    console.log("Phone validation failed for:", phone);
  }
  
  return isValid;
};
