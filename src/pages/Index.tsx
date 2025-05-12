
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // If user is logged in, redirect to their appropriate dashboard
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      // If no user, redirect to home page
      navigate("/");
    }
  }, [navigate, user]);

  return null;
};

export default Index;
