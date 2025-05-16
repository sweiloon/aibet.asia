import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User, Menu, X } from "lucide-react";
import { Buttons } from "./Buttons";

export function Navbar() {
  const { user, logout, checkAdminExists, adminStateVersion } = useAuth();
  const navigate = useNavigate();
  const [adminExists, setAdminExists] = useState(true);
  const [isLoadingAdminCheck, setIsLoadingAdminCheck] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAdmin = async () => {
      console.log("NAVBAR: Checking admin existence...");
      setIsLoadingAdminCheck(true);
      const exists = await checkAdminExists();
      if (isMounted) {
        console.log("NAVBAR: Admin exists status:", exists);
        setAdminExists(exists);
        setIsLoadingAdminCheck(false);
      }
    };

    checkAdmin();
    return () => {
      isMounted = false;
    };
  }, [checkAdminExists, adminStateVersion]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const showAdminSetupButton = !isLoadingAdminCheck && !user && !adminExists;

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100vw-32px)] max-w-4xl -translate-x-1/2 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-lg shadow-[0_2px_24px_0_rgba(140,69,255,0.12)] py-2 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-semibold text-white flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L13.09 8.26L19 8.27L14.18 12.14L15.27 18.4L12 14.77L8.73 18.4L9.82 12.14L5 8.27L10.91 8.26L12 2Z"
              fill="#fff"
              fillOpacity="0.9"
            />
          </svg>
          AIBET.ASIA
        </span>
      </Link>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <button
          className="text-base text-white/80 font-normal bg-transparent border-none outline-none cursor-pointer"
          onClick={() =>
            document
              .getElementById("features-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          功能
        </button>
        <button
          className="text-base text-white/80 font-normal bg-transparent border-none outline-none cursor-pointer"
          onClick={() => {
            const section = document.getElementById("features-section");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
              setTimeout(() => {
                const rect = section.getBoundingClientRect();
                window.scrollBy({
                  top: rect.height / 2,
                  left: 0,
                  behavior: "smooth",
                });
              }, 500);
            }
          }}
        >
          价格
        </button>
        <button
          className="text-base text-white/80 font-normal bg-transparent border-none outline-none cursor-pointer"
          onClick={() =>
            document
              .getElementById("testimonials-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          客户反馈
        </button>
        <button
          className="text-base text-white/80 font-normal bg-transparent border-none outline-none cursor-pointer"
          onClick={() =>
            document
              .getElementById("cta-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          联系我们
        </button>
      </div>
      {/* Desktop User Actions */}
      <div className="hidden md:flex items-center gap-4">
        {!user ? (
          <>
            <Button
              variant="ghost"
              className="text-white/80"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Buttons onClick={() => navigate("/signup")}>Join Now</Buttons>
            {showAdminSetupButton && (
              <Button
                variant="outline"
                onClick={() => navigate("/admin-signup")}
              >
                Admin Setup
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={() =>
                navigate(user.role === "admin" ? "/admin" : "/dashboard")
              }
            >
              Dashboard
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.role === "admin" ? "Administrator" : "User"}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(user.role === "admin" ? "/admin" : "/dashboard")
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      user.role === "admin"
                        ? "/admin/settings"
                        : "/dashboard/settings"
                    )
                  }
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      {/* Mobile Burger Icon */}
      <button
        className="md:hidden flex items-center justify-center p-2 text-white"
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-7 w-7" />
      </button>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-lg transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          {/* Menu Panel */}
          <div className="relative w-[90vw] max-w-sm mx-auto rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl flex flex-col animate-fade-in-up my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-xl font-semibold text-white flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L19 8.27L14.18 12.14L15.27 18.4L12 14.77L8.73 18.4L9.82 12.14L5 8.27L10.91 8.26L12 2Z"
                    fill="#fff"
                    fillOpacity="0.9"
                  />
                </svg>
                AIBET.ASIA
              </span>
              <button
                className="p-2 text-white"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-7 w-7" />
              </button>
            </div>
            <div className="flex flex-col gap-6 px-8 py-8 text-lg">
              <button
                className="text-white text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document
                    .getElementById("features-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                功能
              </button>
              <button
                className="text-white text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  const section = document.getElementById("features-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                      const rect = section.getBoundingClientRect();
                      window.scrollBy({
                        top: rect.height / 2,
                        left: 0,
                        behavior: "smooth",
                      });
                    }, 500);
                  }
                }}
              >
                价格
              </button>
              <button
                className="text-white text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document
                    .getElementById("testimonials-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                客户反馈
              </button>
              <button
                className="text-white text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document
                    .getElementById("cta-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                联系我们
              </button>
              <div className="border-t border-white/10 my-4" />
              {!user ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-white/80 w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Buttons
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/signup");
                    }}
                  >
                    Join Now
                  </Buttons>
                  {showAdminSetupButton && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/admin-signup");
                      }}
                    >
                      Admin Setup
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(user.role === "admin" ? "/admin" : "/dashboard");
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(
                        user.role === "admin"
                          ? "/admin/settings"
                          : "/dashboard/settings"
                      );
                    }}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
