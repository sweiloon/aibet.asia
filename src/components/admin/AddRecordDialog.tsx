
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useWebsites, Website } from "@/context/WebsiteContext";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
}

export function AddRecordDialog({ open, onOpenChange, websiteId }: AddRecordDialogProps) {
  const { addManagementRecord, getAllWebsites } = useWebsites();
  
  const website = getAllWebsites().find(site => site.id === websiteId);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [credit, setCredit] = useState<string>("");
  const [profit, setProfit] = useState<string>("");
  const [grossProfit, setGrossProfit] = useState<string>("");
  const [serviceFee, setServiceFee] = useState<string>("");
  const [netProfit, setNetProfit] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
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
    
    addManagementRecord(websiteId, {
      date: date.toISOString(),
      tasks
    });
    
    toast.success("Record added successfully");
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setDate(new Date());
    setCredit("");
    setProfit("");
    setGrossProfit("");
    setServiceFee("");
    setNetProfit("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Record for {website?.name}</DialogTitle>
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
            <Button type="submit">Save Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
