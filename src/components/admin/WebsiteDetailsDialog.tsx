
import { Website } from "@/context/WebsiteContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface WebsiteDetailsDialogProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WebsiteDetailsDialog = ({ website, isOpen, onClose }: WebsiteDetailsDialogProps) => {
  if (!website) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Website Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <div className="font-medium">{website.name}</div>
            </div>
            <div>
              <Label>Status</Label>
              <div className="font-medium capitalize">{website.status}</div>
            </div>
          </div>
          
          {website.userEmail && (
            <div>
              <Label>User Email</Label>
              <div className="font-medium">{website.userEmail}</div>
            </div>
          )}
          
          <div>
            <Label>URL</Label>
            <div className="font-medium">
              <a href={website.url} target="_blank" rel="noopener noreferrer" className="underline">
                {website.url}
              </a>
            </div>
          </div>
          
          {website.loginUrl && (
            <div>
              <Label>Login URL</Label>
              <div className="font-medium">
                <a href={website.loginUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {website.loginUrl}
                </a>
              </div>
            </div>
          )}
          
          {website.username && (
            <div>
              <Label>Username</Label>
              <div className="font-medium">{website.username}</div>
            </div>
          )}
          
          {website.password && (
            <div>
              <Label>Password</Label>
              <div className="font-medium">{website.password}</div>
            </div>
          )}
          
          <div className="pt-4">
            <Button onClick={onClose} className="w-full">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
