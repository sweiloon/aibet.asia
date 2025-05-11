import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IdCard, Banknote, Upload, FileText, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWebsites } from "@/context/WebsiteContext";

export default function UploadDocument() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWebsite } = useWebsites();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("id-card");
  
  // ID Card state
  const [idFrontImage, setIdFrontImage] = useState<File | null>(null);
  const [idBackImage, setIdBackImage] = useState<File | null>(null);
  
  // Bank Statement state
  const [bankStatementFiles, setBankStatementFiles] = useState<File[]>([]);
  
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
  
  const handleBankStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setBankStatementFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeBankStatementFile = (index: number) => {
    setBankStatementFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleIdCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idFrontImage) {
      toast({
        title: "Front ID Image Required",
        description: "Please upload a front image of your ID card.",
        variant: "destructive"
      });
      return;
    }
    
    if (!idBackImage) {
      toast({
        title: "Back ID Image Required",
        description: "Please upload a back image of your ID card.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert files to file objects with URLs (in a real app, these would be uploaded to a server)
    const files = [
      {
        name: idFrontImage.name,
        url: URL.createObjectURL(idFrontImage),
        type: idFrontImage.type
      },
      {
        name: idBackImage.name,
        url: URL.createObjectURL(idBackImage),
        type: idBackImage.type
      }
    ];
    
    // Add the ID card submission to the website context
    addWebsite({
      name: "ID Card Submission",
      url: "N/A",
      type: "id-card",
      files
    });
    
    setTimeout(() => {
      toast({
        title: "ID Card Submitted",
        description: "Your ID card has been successfully submitted for review.",
      });
      setIsSubmitting(false);
      navigate("/dashboard/upload-history");
    }, 1000);
  };
  
  const handleBankStatementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bankStatementFiles.length === 0) {
      toast({
        title: "Bank Statement Required",
        description: "Please upload at least one bank statement.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert files to file objects with URLs (in a real app, these would be uploaded to a server)
    const files = bankStatementFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    
    // Add the bank statement submission to the website context
    addWebsite({
      name: "Bank Statement Submission",
      url: "N/A",
      type: "bank-statement",
      files
    });
    
    setTimeout(() => {
      toast({
        title: "Bank Statement Submitted",
        description: "Your bank statement has been successfully submitted for review.",
      });
      setIsSubmitting(false);
      navigate("/dashboard/upload-history");
    }, 1000);
  };
  
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
            <Card>
              <CardHeader>
                <CardTitle>Upload ID Card</CardTitle>
                <CardDescription>Please upload both front and back images of your ID card</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleIdCardSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="id-front">ID Card Front</Label>
                      <div className="mt-2">
                        {idFrontImage ? (
                          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={URL.createObjectURL(idFrontImage)} 
                              alt="ID Front" 
                              className="w-full h-full object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full"
                              type="button"
                              onClick={() => setIdFrontImage(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <IdCard className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">Click to upload front side image</p>
                            <Input 
                              id="id-front" 
                              type="file"
                              accept="image/*"
                              onChange={handleIdFrontUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => document.getElementById("id-front")?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Browse Files
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="id-back">ID Card Back</Label>
                      <div className="mt-2">
                        {idBackImage ? (
                          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={URL.createObjectURL(idBackImage)} 
                              alt="ID Back" 
                              className="w-full h-full object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full"
                              type="button"
                              onClick={() => setIdBackImage(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <IdCard className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">Click to upload back side image</p>
                            <Input 
                              id="id-back" 
                              type="file"
                              accept="image/*"
                              onChange={handleIdBackUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => document.getElementById("id-back")?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Browse Files
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
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
          </TabsContent>
          
          <TabsContent value="bank-statement">
            <Card>
              <CardHeader>
                <CardTitle>Upload Bank Statement</CardTitle>
                <CardDescription>Please upload your bank statement documents (PDF format)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBankStatementSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="bank-statement">Bank Statement</Label>
                    <div className="mt-2">
                      <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Click to upload PDF files</p>
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
                          onClick={() => document.getElementById("bank-statement")?.click()}
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
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm truncate max-w-md">{file.name}</span>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
