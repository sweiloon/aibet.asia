
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditFieldDialogProps {
  field: string;
  initialValue: string | number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string | number) => void;
  fieldType?: "text" | "number" | "date";
}

export const EditFieldDialog = ({ 
  field, 
  initialValue, 
  isOpen, 
  onClose, 
  onSave,
  fieldType = "text" 
}: EditFieldDialogProps) => {
  const [value, setValue] = useState<string | number>(initialValue);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {field}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-value">Value</Label>
            <Input
              id="edit-value"
              type={fieldType}
              value={value}
              onChange={(e) => setValue(fieldType === "number" ? Number(e.target.value) : e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(value)}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
