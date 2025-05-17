import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TFunction } from "i18next";
import { i18n as I18nInstanceType } from "i18next";

interface EditFieldDialogProps {
  field: string; // This will be the key for translation if the field name itself needs to be dynamic
  initialValue: string | number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string | number) => void;
  fieldType?: "text" | "number" | "date";
  t: TFunction;
  i18n: I18nInstanceType;
}

export const EditFieldDialog = ({
  field,
  initialValue,
  isOpen,
  onClose,
  onSave,
  fieldType = "text",
  t,
  i18n,
}: EditFieldDialogProps) => {
  const [value, setValue] = useState<string | number>(initialValue);

  // Translate the field name for the dialog title if a key exists for it
  // Otherwise, use the field name as is (e.g., for dynamic technical field names)
  const translatedFieldName = t(field, { defaultValue: field });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("Edit {{field}}", { field: translatedFieldName })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-value">{t("Value")}</Label>
            <Input
              id="edit-value"
              type={fieldType}
              value={value}
              onChange={(e) =>
                setValue(
                  fieldType === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button onClick={() => onSave(value)}>{t("Update")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
