import { Website } from "@/context/WebsiteContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { openInNewTab } from "@/lib/openInNewTab";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface WebsiteDetailsDialogProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
  i18n: I18nInstanceType;
}

export const WebsiteDetailsDialog = ({
  website,
  isOpen,
  onClose,
  t,
  i18n,
}: WebsiteDetailsDialogProps) => {
  if (!website) return null;

  const translatedStatus = t(
    website.status.charAt(0).toUpperCase() + website.status.slice(1)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Website Details")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Name")}</Label>
              <div className="font-medium">{website.name}</div>
            </div>
            <div>
              <Label>{t("Status")}</Label>
              <div className="font-medium capitalize">{translatedStatus}</div>
            </div>
          </div>

          {website.useremail && (
            <div>
              <Label>{t("User Email")}</Label>
              <div className="font-medium">{website.useremail}</div>
            </div>
          )}

          <div>
            <Label>{t("URL")}</Label>
            <div className="font-medium">
              <a
                href={website.url}
                className="underline"
                tabIndex={0}
                role="link"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  openInNewTab(website.url);
                }}
              >
                {website.url}
              </a>
            </div>
          </div>

          {website.adminUrl && (
            <div>
              <Label>{t("Login URL")}</Label>
              <div className="font-medium">
                <a
                  href={website.adminUrl}
                  className="underline"
                  tabIndex={0}
                  role="link"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    openInNewTab(website.adminUrl);
                  }}
                >
                  {website.adminUrl}
                </a>
              </div>
            </div>
          )}

          {/* Credentials Section: Show if either adminCredentials or username/password fields exist */}
          {(website.adminCredentials ||
            // @ts-expect-error: username/password may exist on legacy Website objects
            website.username ||
            // @ts-expect-error: username/password may exist on legacy Website objects
            website.password) && (
            <div>
              <Label>{t("Credentials")}</Label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <Label>{t("Username")}</Label>
                  <div className="font-medium">
                    {website.adminCredentials
                      ? website.adminCredentials.username
                      : // @ts-expect-error: username may exist on legacy Website objects
                        website.username || t("Not provided")}
                  </div>
                </div>
                <div>
                  <Label>{t("Password")}</Label>
                  <div className="font-medium">
                    {website.adminCredentials
                      ? website.adminCredentials.password
                      : // @ts-expect-error: password may exist on legacy Website objects
                        website.password || t("Not provided")}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={onClose} className="w-full">
              {t("Close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
