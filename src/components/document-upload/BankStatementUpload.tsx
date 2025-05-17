import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWebsites, WebsiteType } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";
import { useAuth } from "@/context/AuthContext";

interface BankStatementUploadProps {
  t: TFunction;
  i18n: I18nInstanceType;
}

export const BankStatementUpload = ({ t, i18n }: BankStatementUploadProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWebsite } = useWebsites();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankStatementFiles, setBankStatementFiles] = useState<File[]>([]);

  const handleBankStatementUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setBankStatementFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeBankStatementFile = (index: number) => {
    setBankStatementFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBankStatementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bankStatementFiles.length === 0) {
      toast({
        title: t("Bank Statement Required"),
        description: t("Please upload at least one bank statement."),
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const uploads = bankStatementFiles.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `bank-statements/${Date.now()}-${sanitizedFileName}`;
        const { error } = await supabase.storage
          .from("documents")
          .upload(filePath, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        const { data } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);
        return {
          name: file.name,
          url: data.publicUrl,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };
      });
      const files = await Promise.all(uploads);

      const websiteData = {
        name: t("Bank Statement Submission"),
        url: "N/A",
        type: "bank-statement" as WebsiteType,
        files: files,
        useremail: user?.email || "",
      };

      await addWebsite(websiteData);
      toast({
        title: t("Bank Statement Submitted"),
        description: t(
          "Your bank statement has been successfully submitted for review."
        ),
      });
      navigate("/dashboard/upload-history");
    } catch (err: unknown) {
      let message = t("There was a problem submitting your bank statement.");
      if (isErrorWithMessage(err)) {
        message = err.message;
      }
      toast({
        title: t("Upload Failed"),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Upload Bank Statement")}</CardTitle>
        <CardDescription>
          {t("Please upload your bank statement documents (PDF format)")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBankStatementSubmit} className="space-y-6">
          <div>
            <Label htmlFor="bank-statement">{t("Bank Statement")}</Label>
            <div className="mt-2">
              <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t("Click to upload PDF files")}
                </p>
                <Input
                  id="bank-statement"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleBankStatementUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("bank-statement")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t("Browse Files")}
                </Button>
              </div>
            </div>
          </div>

          {bankStatementFiles.length > 0 && (
            <div>
              <Label>{t("Selected Files")}</Label>
              <div className="mt-2 space-y-2">
                {bankStatementFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate max-w-md">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => removeBankStatementFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || bankStatementFiles.length === 0}
            >
              {isSubmitting ? t("Submitting...") : t("Submit Bank Statement")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}
