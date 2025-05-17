import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings, ShieldCheck } from "lucide-react";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface AccountItemsProps {
  isAdmin?: boolean;
  className?: string;
  t: TFunction;
  i18n: I18nInstanceType;
}
export function AccountItems({
  isAdmin = false,
  className,
  t,
  i18n,
}: AccountItemsProps) {
  const navigate = useNavigate();
  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button
            onClick={() =>
              navigate(isAdmin ? "/admin/settings" : "/dashboard/settings")
            }
          >
            <Settings />
            <span>{t("Settings")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <button onClick={() => navigate("/admin/users")}>
              <ShieldCheck />
              <span>{t("User Management")}</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
