import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdCard, Banknote } from "lucide-react";
import { IdCardUpload } from "@/components/document-upload/IdCardUpload";
import { BankStatementUpload } from "@/components/document-upload/BankStatementUpload";
import { useTranslation } from "react-i18next";

export default function UploadDocument() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("id-card");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("Upload Document")}</h1>
          <p className="text-muted-foreground">
            {t("Upload your ID card or bank statement for verification")}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-3xl mx-auto"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="id-card" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              <span>{t("ID Card")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="bank-statement"
              className="flex items-center gap-2"
            >
              <Banknote className="h-4 w-4" />
              <span>{t("Bank Statement")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="id-card">
            <IdCardUpload t={t} i18n={i18n} />
          </TabsContent>

          <TabsContent value="bank-statement">
            <BankStatementUpload t={t} i18n={i18n} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
