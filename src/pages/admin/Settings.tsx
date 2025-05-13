import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
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
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, changePassword, logout } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result) {
        setLoading(false);
        toast({
          title:
            "Password updated successfully! Please login again with your new password.",
          variant: "default",
        });
        setTimeout(() => {
          logout();
        }, 1800);
      } else {
        toast({ title: "Failed to update password.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Failed to update password.", variant: "destructive" });
    } finally {
      if (loading) setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage your admin account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your admin account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{user?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Change Admin Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="currentPassword"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((v) => !v)}
                        className="absolute right-2 top-2 text-muted-foreground"
                      >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNew ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="absolute right-2 top-2 text-muted-foreground"
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="confirmNewPassword"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-2 top-2 text-muted-foreground"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {newPassword !== confirmNewPassword &&
                      confirmNewPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    disabled={loading || newPassword !== confirmNewPassword}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
