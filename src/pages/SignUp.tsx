import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("+60");
  const [loading, setLoading] = useState(false);
  const { signup, getAllUsers, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const validatePhone = (value: string) => {
    // Phone must start with +60 followed by a digit from 1-9
    const phonePattern = /^\+60[1-9]/;
    return phonePattern.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Ensure phone always starts with +60
    if (!value.startsWith("+60")) {
      setPhone("+60");
    } else {
      setPhone(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error(
        "Phone number must start with +60 followed by a digit from 1-9"
      );
      return;
    }

    // Check if phone number already exists
    let users: { phone?: string }[] = [];
    try {
      users = await getAllUsers();
    } catch {
      users = [];
    }
    if (Array.isArray(users)) {
      const phoneExists = users.some((user) => user.phone === phone);
      if (phoneExists) {
        toast.error("This phone number has already been registered!");
        return;
      }
    }

    setLoading(true);
    const success = await signup(email, password, phone, name);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      placeholder="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-24"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      @aibet.asia
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    placeholder="+60"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="underline text-primary hover:text-primary/80"
                  >
                    Log in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
