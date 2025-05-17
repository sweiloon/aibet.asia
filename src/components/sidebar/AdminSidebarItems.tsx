import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Globe2,
  ClipboardCheck,
  ListChecks,
} from "lucide-react";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface AdminSidebarItemsProps {
  className?: string;
  t: TFunction;
  i18n: I18nInstanceType;
}

export function AdminSidebarItems({
  className,
  t,
  i18n,
}: AdminSidebarItemsProps) {
  const navigate = useNavigate();

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/admin")}>
            <LayoutDashboard />
            <span>{t("Dashboard")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/admin/websites")}>
            <Globe2 />
            <span>{t("Websites")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/admin/website-records")}>
            <ListChecks />
            <span>{t("Website Records")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/admin/approvals")}>
            <ClipboardCheck />
            <span>{t("Approvals")}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
