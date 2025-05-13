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
import { useWebsites } from "@/context/WebsiteContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const IdCardUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWebsite } = useWebsites();
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
        title: "Front ID Image Required",
        description: "Please upload a front image of your ID card.",
        variant: "destructive",
      });
      return;
    }
    if (!idBackImage) {
      toast({
        title: "Back ID Image Required",
        description: "Please upload a back image of your ID card.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload both images to Supabase Storage
      const uploads = [idFrontImage, idBackImage].map(async (file, idx) => {
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `id-cards/${Date.now()}-${sanitizedFileName}`;
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
        name: "ID Card Submission",
        url: "N/A",
        type: "id-card",
        files,
      });
      toast({
        title: "ID Card Submitted",
        description: "Your ID card has been successfully submitted for review.",
      });
      navigate("/dashboard/upload-history");
    } catch (err: unknown) {
      let message = "There was a problem uploading your ID card images.";
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
        <CardTitle>Upload ID Card</CardTitle>
        <CardDescription>
          Please upload both front and back images of your ID card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleIdCardSubmit} className="space-y-6">
          <div className="space-y-4">
            <ImageUploadField
              id="id-front"
              label="ID Card Front"
              image={idFrontImage}
              onUpload={handleIdFrontUpload}
              onClear={() => setIdFrontImage(null)}
            />

            <ImageUploadField
              id="id-back"
              label="ID Card Back"
              image={idBackImage}
              onUpload={handleIdBackUpload}
              onClear={() => setIdBackImage(null)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !idFrontImage || !idBackImage}
            >
              {isSubmitting ? "Submitting..." : "Submit ID Card"}
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
}

const ImageUploadField = ({
  id,
  label,
  image,
  onUpload,
  onClear,
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
              Click to upload {label.toLowerCase()} image
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
              Browse Files
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
