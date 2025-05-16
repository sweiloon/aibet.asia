import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  isAdmin?: boolean;
}

export function DashboardHeader({ isAdmin = false }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-16 border-b border-border flex items-center px-6 justify-between">
      <div className="flex items-center">
        <SidebarTrigger />
        <div className="ml-4 font-medium">
          {isAdmin ? "Administrator Dashboard" : "User Dashboard"}
        </div>
      </div>
      <>
        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <img src="/ws.png" alt="WhatsApp" className="w-5 h-5" />
          WhatsApp
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xs text-center">
            <DialogHeader>
              <DialogTitle>Contact Us</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              Please contact{" "}
              <span className="font-semibold">+6011-12006061</span> (Whatsapp)
              for further enquiry
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
}
