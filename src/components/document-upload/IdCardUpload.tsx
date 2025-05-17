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
import { IdCard, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWebsites, WebsiteType } from "@/context/website";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";
import { useAuth } from "@/context/AuthContext";

interface IdCardUploadProps {
  t: TFunction;
  i18n: I18nInstanceType;
}

export const IdCardUpload = ({ t, i18n }: IdCardUploadProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWebsite } = useWebsites();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idFrontImage, setIdFrontImage] = useState<File | null>(null);
  const [idBackImage, setIdBackImage] = useState<File | null>(null);

  const handleIdFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFrontImage(e.target.files[0]);
    }
  };

  const handleIdBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdBackImage(e.target.files[0]);
    }
  };

  const handleIdCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFrontImage) {
      toast({
        title: t("Front ID Image Required"),
        description: t("Please upload a front image of your ID card."),
        variant: "destructive",
      });
      return;
    }
    if (!idBackImage) {
      toast({
        title: t("Back ID Image Required"),
        description: t("Please upload a back image of your ID card."),
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const uploads = [idFrontImage, idBackImage].map(async (file, idx) => {
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `id-cards/${Date.now()}-${sanitizedFileName}`;
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
        name: t("ID Card Submission"),
        url: "N/A",
        type: "id-card" as WebsiteType,
        files: files,
        useremail: user?.email || "",
      };

      await addWebsite(websiteData);

      toast({
        title: t("ID Card Submitted"),
        description: t(
          "Your ID card has been successfully submitted for review."
        ),
      });
      navigate("/dashboard/upload-history");
    } catch (err: unknown) {
      let message = t("There was a problem uploading your ID card images.");
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
        <CardTitle>{t("Upload ID Card")}</CardTitle>
        <CardDescription>
          {t("Please upload both front and back images of your ID card")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleIdCardSubmit} className="space-y-6">
          <div className="space-y-4">
            <ImageUploadField
              id="id-front"
              label={t("ID Card Front")}
              image={idFrontImage}
              onUpload={handleIdFrontUpload}
              onClear={() => setIdFrontImage(null)}
              t={t}
            />

            <ImageUploadField
              id="id-back"
              label={t("ID Card Back")}
              image={idBackImage}
              onUpload={handleIdBackUpload}
              onClear={() => setIdBackImage(null)}
              t={t}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !idFrontImage || !idBackImage}
            >
              {isSubmitting ? t("Submitting...") : t("Submit ID Card")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface ImageUploadFieldProps {
  id: string;
  label: string;
  image: File | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  t: TFunction;
}

const ImageUploadField = ({
  id,
  label,
  image,
  onUpload,
  onClear,
  t,
}: ImageUploadFieldProps) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">
        {image ? (
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(image)}
              alt={label}
              className="w-full h-full object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              type="button"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <IdCard className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              {t("Click to upload {{label}} image", {
                label: label.toLowerCase(),
              })}
            </p>
            <Input
              id={id}
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => document.getElementById(id)?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("Browse Files")}
            </Button>
          </div>
        )}
      </div>
    </div>
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
