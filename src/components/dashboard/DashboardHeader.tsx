import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DashboardHeaderProps {
  isAdmin?: boolean;
}

export function DashboardHeader({ isAdmin = false }: DashboardHeaderProps) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="h-16 border-b border-border flex items-center px-6 justify-between">
      <div className="flex items-center">
        <SidebarTrigger />
        <div className="ml-4 font-medium">
          {isAdmin ? t("Administrator Dashboard") : t("User Dashboard")}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={toggleLanguage}
          className="flex items-center gap-2"
        >
          {i18n.language === "en"
            ? t("Switch to Chinese")
            : t("Switch to English")}
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.open("https://wa.me/601112006061", "_blank")}
        >
          <img src="/ws.png" alt="WhatsApp" className="w-5 h-5" />
          {t("WhatsApp")}
        </Button>
      </div>
    </div>
  );
}
