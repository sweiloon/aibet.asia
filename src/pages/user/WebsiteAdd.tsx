import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { useWebsites, WebsiteType } from "@/context/website";
import { toast } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

export default function WebsiteAdd() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);

  const { addWebsite } = useWebsites();
  const navigate = useNavigate();

  // URL validation function
  const validateUrl = (value: string): boolean => {
    // Accept URLs with or without protocol
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(value);
  };

  const formatUrl = (value: string): string => {
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return "https://" + value;
    }
    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setPasswordError("");
    setUrlError("");

    const translatedPasswordError = t("Passwords do not match");
    const translatedUrlError = t("Please enter a valid URL");

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError(translatedPasswordError);
      toast.error(translatedPasswordError);
      return;
    }

    // Validate URL format
    if (!validateUrl(url)) {
      setUrlError(translatedUrlError);
      toast.error(translatedUrlError);
      return;
    }

    setLoading(true);

    try {
      // Format URL if needed
      const formattedUrl = formatUrl(url);

      // Create website object
      const websiteData = {
        name,
        url: formattedUrl,
        username,
        password,
        type: "website" as WebsiteType,
        useremail: user?.email || "",
      };

      addWebsite(websiteData);
      toast.success(t("Website submitted successfully"));
      navigate("/dashboard/websites");
    } catch (error) {
      console.error("Error submitting website:", error);
      toast.error(t("Failed to submit website"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Upload Website")}</h1>
          <p className="text-muted-foreground">
            {t("Submit a new website for management")}
          </p>
        </div>

        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>{t("Website Details")}</CardTitle>
            <CardDescription>
              {t("Fill in the details of the website you want us to manage")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("Website Name")}</Label>
                  <Input
                    id="name"
                    placeholder={t("My Company Website")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">{t("Website URL")}</Label>
                  <Input
                    id="url"
                    placeholder={t("www.example.com")}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setUrlError("");
                    }}
                    className={urlError ? "border-red-500" : ""}
                    required
                  />
                  {urlError && (
                    <p className="text-xs text-red-500">{urlError}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 space-y-6 border-t border-border">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t("Admin Username")}</Label>
                    <Input
                      id="username"
                      placeholder={t("admin")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("Admin Password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      {t("Confirm Password")}
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className={passwordError ? "border-red-500" : ""}
                      required
                    />
                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  {t(
                    "Your credentials are securely stored and only used for management purposes."
                  )}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/websites")}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("Submitting...") : t("Submit Website")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
