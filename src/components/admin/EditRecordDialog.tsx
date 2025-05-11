
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useWebsites, WebsiteManagement } from "@/context/WebsiteContext";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EditRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
  recordId: string;
}

export function EditRecordDialog({ open, onOpenChange, websiteId, recordId }: EditRecordDialogProps) {
  const { updateManagementRecord, getAllWebsites } = useWebsites();
  
  const website = getAllWebsites().find(site => site.id === websiteId);
  const record = website?.managementData.find(record => record.id === recordId);
  
  const [date, setDate] = useState<Date | undefined>(record ? new Date(record.date) : new Date());
  const [credit, setCredit] = useState<string>("");
  const [profit, setProfit] = useState<string>("");
  const [grossProfit, setGrossProfit] = useState<string>("");
  const [serviceFee, setServiceFee] = useState<string>("");
  const [netProfit, setNetProfit] = useState<string>("");
  
  // Load existing data
  useEffect(() => {
    if (record) {
      setDate(new Date(record.date));
      
      const creditTask = record.tasks.find(t => t.type === "credit");
      const profitTask = record.tasks.find(t => t.type === "profit");
      const grossProfitTask = record.tasks.find(t => t.type === "gross_profit");
      const serviceFeeTask = record.tasks.find(t => t.type === "service_fee");
      const netProfitTask = record.tasks.find(t => t.type === "net_profit");
      
      setCredit(creditTask?.description || "");
      setProfit(profitTask?.description || "");
      setGrossProfit(grossProfitTask?.description || "");
      setServiceFee(serviceFeeTask?.description || "");
      setNetProfit(netProfitTask?.description || "");
    }
  }, [record]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !record) {
      toast.error("Please select a date");
      return;
    }
    
    const tasks = [
      { type: "credit", description: credit, status: "completed" as const },
      { type: "profit", description: profit, status: "completed" as const },
      { type: "gross_profit", description: grossProfit, status: "completed" as const },
      { type: "service_fee", description: serviceFee, status: "completed" as const },
      { type: "net_profit", description: netProfit, status: "completed" as const }
    ];
    
    updateManagementRecord(websiteId, recordId, tasks);
    
    toast.success("Record updated successfully");
    onOpenChange(false);
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Record for {website?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="credit">Credit</Label>
            <Input
              id="credit"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="Enter credit amount"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="profit">Profit</Label>
            <Input
              id="profit"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              placeholder="Enter profit amount"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="grossProfit">Gross Profit</Label>
            <Input
              id="grossProfit"
              value={grossProfit}
              onChange={(e) => setGrossProfit(e.target.value)}
              placeholder="Enter gross profit amount"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="serviceFee">Service Fee</Label>
            <Input
              id="serviceFee"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              placeholder="Enter service fee amount"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="netProfit">Net Profit</Label>
            <Input
              id="netProfit"
              value={netProfit}
              onChange={(e) => setNetProfit(e.target.value)}
              placeholder="Enter net profit amount"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Update Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
