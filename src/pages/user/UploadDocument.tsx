
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdCard, Banknote } from "lucide-react";
import { IdCardUpload } from "@/components/document-upload/IdCardUpload";
import { BankStatementUpload } from "@/components/document-upload/BankStatementUpload";

export default function UploadDocument() {
  const [activeTab, setActiveTab] = useState("id-card");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Document</h1>
          <p className="text-muted-foreground">Upload your ID card or bank statement for verification</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="id-card" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              <span>ID Card</span>
            </TabsTrigger>
            <TabsTrigger value="bank-statement" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              <span>Bank Statement</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="id-card">
            <IdCardUpload />
          </TabsContent>
          
          <TabsContent value="bank-statement">
            <BankStatementUpload />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
