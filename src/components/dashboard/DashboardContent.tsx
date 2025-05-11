
import { ReactNode } from "react";

interface DashboardContentProps {
  children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      {children}
    </div>
  );
}
