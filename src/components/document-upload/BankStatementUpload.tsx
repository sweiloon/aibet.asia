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
import { useWebsites } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const BankStatementUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWebsite } = useWebsites();
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
        title: "Bank Statement Required",
        description: "Please upload at least one bank statement.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload all PDFs to Supabase Storage
      const uploads = bankStatementFiles.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `bank-statements/${Date.now()}-${sanitizedFileName}`;
        // Ensure the 'documents' bucket exists and is public in Supabase dashboard if you get 400 errors
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
        };
      });
      const files = await Promise.all(uploads);
      await addWebsite({
        name: "Bank Statement Submission",
        url: "N/A",
        type: "bank-statement",
        files,
      });
      toast({
        title: "Bank Statement Submitted",
        description:
          "Your bank statement has been successfully submitted for review.",
      });
      navigate("/dashboard/upload-history");
    } catch (err: unknown) {
      let message = "There was a problem submitting your bank statement.";
      if (isErrorWithMessage(err)) {
        message = err.message;
      }
      toast({
        title: "Upload Failed",
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
        <CardTitle>Upload Bank Statement</CardTitle>
        <CardDescription>
          Please upload your bank statement documents (PDF format)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBankStatementSubmit} className="space-y-6">
          <div>
            <Label htmlFor="bank-statement">Bank Statement</Label>
            <div className="mt-2">
              <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload PDF files
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
                  Browse Files
                </Button>
              </div>
            </div>
          </div>

          {bankStatementFiles.length > 0 && (
            <div>
              <Label>Selected Files</Label>
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
              {isSubmitting ? "Submitting..." : "Submit Bank Statement"}
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
