import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function UserSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Settings")}</h1>
          <p className="text-muted-foreground">
            {t("Manage your account settings")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>{t("Account Information")}</CardTitle>
                <CardDescription>
                  {t("Your basic account details")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("Email")}
                    </p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Role")}</p>
                    <p className="font-medium capitalize">
                      {user?.role
                        ? t(
                            user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>{t("Change Password")}</CardTitle>
                <CardDescription>
                  {t("Change Password Feature Coming Soon")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <span className="text-muted-foreground text-lg font-semibold">
                    {t("Change Password Feature Coming Soon")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
