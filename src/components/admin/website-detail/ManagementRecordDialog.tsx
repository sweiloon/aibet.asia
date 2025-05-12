
import { useState, useEffect } from "react";
import { WebsiteManagement } from "@/context/WebsiteContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  type: string;
  description: string;
  status: string;
}

interface ManagementRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (date: string, tasks: Task[]) => void;
  editRecord: WebsiteManagement | null;
  websiteName: string;
}

export function ManagementRecordDialog({
  open,
  onOpenChange,
  onSave,
  editRecord,
  websiteName
}: ManagementRecordDialogProps) {
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [tasks, setTasks] = useState<Task[]>([
    { type: "Backup", description: "Full website backup", status: "completed" },
    { type: "Security", description: "Security scan and updates", status: "completed" },
    { type: "Performance", description: "Performance optimization", status: "pending" }
  ]);

  // Initialize form when editing a record
  useEffect(() => {
    if (editRecord) {
      setRecordDate(new Date(editRecord.date || editRecord.startDate).toISOString().split("T")[0]);
      if (editRecord.tasks && editRecord.tasks.length > 0) {
        setTasks(editRecord.tasks);
      }
    } else {
      // Reset to defaults for new record
      setRecordDate(new Date().toISOString().split("T")[0]);
      setTasks([
        { type: "Backup", description: "Full website backup", status: "completed" },
        { type: "Security", description: "Security scan and updates", status: "completed" },
        { type: "Performance", description: "Performance optimization", status: "pending" }
      ]);
    }
  }, [editRecord, open]);

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      { type: "Other", description: "", status: "pending" }
    ]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, field: string, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleSave = () => {
    onSave(recordDate, tasks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editRecord ? "Edit Management Record" : "Add Management Record"}
          </DialogTitle>
          <DialogDescription>
            Record management tasks performed on {websiteName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="record-date">Record Date</Label>
            <Input
              id="record-date"
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Tasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            </div>
            
            {tasks.map((task, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-3">
                  <Select
                    value={task.type}
                    onValueChange={(value) => handleTaskChange(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Backup">Backup</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="SEO">SEO</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-5">
                  <Textarea
                    placeholder="Description"
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                    className="min-h-9 resize-none"
                  />
                </div>
                
                <div className="col-span-3">
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleTaskChange(index, "status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1 flex justify-center items-center h-9">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveTask(index)}
                    disabled={tasks.length <= 1}
                    className="h-8 w-8"
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {editRecord ? "Update Record" : "Add Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
