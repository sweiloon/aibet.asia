
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  ranking: z.enum(["none", "customer", "agent", "master", "ranking"]).optional(),
}).refine(data => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, userData: Partial<User>, newPassword?: string) => Promise<boolean>;
}

export function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      role: user?.role || "user",
      status: user?.status || "active",
      ranking: (user?.ranking && user?.ranking !== "") ? 
        (user.ranking as "customer" | "agent" | "master" | "ranking") : 
        "none",
    },
  });

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (open && user) {
      const values = {
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
        role: user?.role || "user",
        status: user?.status || "active",
        ranking: (user?.ranking && user?.ranking !== "") ? 
          (user.ranking as "customer" | "agent" | "master" | "ranking") : 
          "none",
      };
      
      form.reset(values);
      setInitialValues(values);
    }
  }, [user, open, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!user || !initialValues) return;
    
    setIsSubmitting(true);
    
    try {
      // Only include fields that have been changed
      const userData: Partial<User> = {};
      
      if (values.name !== initialValues.name) userData.name = values.name;
      if (values.email !== initialValues.email) userData.email = values.email;
      if (values.role !== initialValues.role) userData.role = values.role;
      if (values.status !== initialValues.status) userData.status = values.status;
      
      // Special handling for ranking
      const newRanking = values.ranking === "none" ? "" : values.ranking;
      const initialRanking = initialValues.ranking === "none" ? "" : initialValues.ranking;
      
      if (newRanking !== initialRanking) {
        userData.ranking = newRanking;
      }
      
      // Only pass password if it was entered
      const newPassword = values.password ? values.password : undefined;
      
      const success = await onSave(user.id, userData, newPassword);
      
      if (success) {
        toast({
          title: "User updated",
          description: "User details have been successfully updated.",
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user's details and permissions. Only changed fields will be updated.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="User name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={user?.id === undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ranking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ranking</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value || "none"} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ranking" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not Set</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="ranking">Ranking</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Change Password</h3>
              <p className="text-xs text-muted-foreground mb-4">Leave blank to keep the current password</p>
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
