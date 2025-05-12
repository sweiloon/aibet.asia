
import { Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import AdminSignUp from "@/pages/AdminSignUp";
import NotFound from "@/pages/NotFound";

export const publicRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="signup" path="/signup" element={<SignUp />} />,
  <Route key="admin-signup" path="/admin-signup" element={<AdminSignUp />} />,
  <Route key="not-found" path="*" element={<NotFound />} />
];
