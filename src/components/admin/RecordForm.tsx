import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { WebsiteManagement } from "@/context/WebsiteContext";
import { format } from "date-fns";

interface RecordFormProps {
  onSave: (record: Omit<WebsiteManagement, "id" | "website_id">) => void;
  onCancel: () => void;
  initialValues?: Partial<Omit<WebsiteManagement, "id" | "website_id">>;
}

export const RecordForm = ({
  onSave,
  onCancel,
  initialValues,
}: RecordFormProps) => {
  const [formValues, setFormValues] = useState<
    Omit<WebsiteManagement, "id" | "website_id">
  >({
    day: initialValues?.day || "",
    credit: initialValues?.credit || 0,
    profit: initialValues?.profit || 0,
    gross_profit: initialValues?.gross_profit || 0,
    service_fee: initialValues?.service_fee || 0,
    start_date: initialValues?.start_date || format(new Date(), "yyyy-MM-dd"),
    end_date: initialValues?.end_date || format(new Date(), "yyyy-MM-dd"),
    net_profit: initialValues?.net_profit || 0,
    tasks: initialValues?.tasks,
  });

  const handleInputChange = (
    field: keyof Omit<WebsiteManagement, "id" | "website_id">,
    value:
      | string
      | number
      | Array<{ type: string; description: string; status: string }>
  ) => {
    const numericFields = [
      "credit",
      "profit",
      "gross_profit",
      "service_fee",
      "net_profit",
    ];

    if (numericFields.includes(field)) {
      setFormValues({
        ...formValues,
        [field]: Number(value),
      });
    } else {
      setFormValues({
        ...formValues,
        [field]: value,
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
          <Label htmlFor="gross_profit">Gross Profit</Label>
          <Input
            id="gross_profit"
            type="number"
            value={formValues.gross_profit}
            onChange={(e) => handleInputChange("gross_profit", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service_fee">Service Fee</Label>
          <Input
            id="service_fee"
            type="number"
            value={formValues.service_fee}
            onChange={(e) => handleInputChange("service_fee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="net_profit">Net Profit</Label>
          <Input
            id="net_profit"
            type="number"
            value={formValues.net_profit}
            onChange={(e) => handleInputChange("net_profit", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formValues.start_date}
            onChange={(e) => handleInputChange("start_date", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formValues.end_date}
            onChange={(e) => handleInputChange("end_date", e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formValues)}>Save</Button>
      </DialogFooter>
    </div>
  );
};
