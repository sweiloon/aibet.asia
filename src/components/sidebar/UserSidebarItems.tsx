import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Upload,
  History,
  Files,
  ListChecks,
} from "lucide-react";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface UserSidebarItemsProps {
  className?: string;
  t: TFunction;
  i18n: I18nInstanceType;
}

export function UserSidebarItems({
  className,
  t,
  i18n,
}: UserSidebarItemsProps) {
  const navigate = useNavigate();

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard")}>
            <LayoutDashboard />
            <span>{t("Dashboard")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/websites/add")}>
            <Upload />
            <span>{t("Upload Website")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/upload-history")}>
            <History />
            <span>{t("Upload History")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/website-records")}>
            <ListChecks />
            <span>{t("Website Records")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/dashboard/upload-document")}>
            <Files />
            <span>{t("Upload Document")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
