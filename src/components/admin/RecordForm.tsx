
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { WebsiteManagement } from "@/context/WebsiteContext";
import { format } from 'date-fns';

interface RecordFormProps {
  onSave: (record: Omit<WebsiteManagement, "id" | "websiteId">) => void;
  onCancel: () => void;
  initialValues?: Partial<Omit<WebsiteManagement, "id" | "websiteId">>;
}

export const RecordForm = ({ onSave, onCancel, initialValues }: RecordFormProps) => {
  const [formValues, setFormValues] = useState<Omit<WebsiteManagement, "id" | "websiteId">>({
    day: initialValues?.day || "",
    credit: initialValues?.credit || 0,
    profit: initialValues?.profit || 0,
    grossProfit: initialValues?.grossProfit || 0,
    serviceFee: initialValues?.serviceFee || 0,
    startDate: initialValues?.startDate || format(new Date(), 'yyyy-MM-dd'),
    endDate: initialValues?.endDate || format(new Date(), 'yyyy-MM-dd'),
    netProfit: initialValues?.netProfit || 0,
    date: initialValues?.date,
    tasks: initialValues?.tasks
  });

  const handleInputChange = (field: keyof Omit<WebsiteManagement, "id" | "websiteId">, value: any) => {
    const numericFields = ["credit", "profit", "grossProfit", "serviceFee", "netProfit"];
    
    if (numericFields.includes(field)) {
      setFormValues({
        ...formValues,
        [field]: Number(value)
      });
    } else {
      setFormValues({
        ...formValues,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Input
            id="day"
            value={formValues.day}
            onChange={(e) => handleInputChange("day", e.target.value)}
            placeholder="Day number or name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credit">Credit</Label>
          <Input
            id="credit"
            type="number"
            value={formValues.credit}
            onChange={(e) => handleInputChange("credit", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="profit">Profit</Label>
          <Input
            id="profit"
            type="number"
            value={formValues.profit}
            onChange={(e) => handleInputChange("profit", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grossProfit">Gross Profit</Label>
          <Input
            id="grossProfit"
            type="number"
            value={formValues.grossProfit}
            onChange={(e) => handleInputChange("grossProfit", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceFee">Service Fee</Label>
          <Input
            id="serviceFee"
            type="number"
            value={formValues.serviceFee}
            onChange={(e) => handleInputChange("serviceFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="netProfit">Net Profit</Label>
          <Input
            id="netProfit"
            type="number"
            value={formValues.netProfit}
            onChange={(e) => handleInputChange("netProfit", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formValues.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formValues.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formValues)}>Save</Button>
      </DialogFooter>
    </div>
  );
};
