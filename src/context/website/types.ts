
export interface WebsiteManagement {
  id: string;
  websiteId: string;
  day: string;
  credit: number;
  profit: number;
  grossProfit: number;
  serviceFee: number;
  startDate: string;
  endDate: string;
  netProfit: number;
  // Support for legacy code
  date?: string;
  tasks?: Array<{
    type: string;
    description: string;
    status: string;
  }>;
}

export interface Website {
  id: string;
  userId: string;
  userEmail?: string;
  name: string;
  url: string;
  loginUrl?: string;
  username?: string;
  password?: string;
  status: "pending" | "approved" | "rejected";
  managementData: WebsiteManagement[];
  createdAt: string;
  updatedAt?: string;
  type?: "website" | "document" | "id-card" | "bank-statement";
  files?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  rejectionReason?: string;
}

// Context type definition
export interface WebsiteContextType {
  websites: Website[];
  getUserWebsites: () => Website[];
  getAllWebsites: () => Website[];
  addWebsite: (website: Omit<Website, "id" | "userId" | "status" | "managementData" | "createdAt">) => void;
  updateWebsiteStatus: (id: string, status: Website["status"], rejectionReason?: string) => void;
  addManagementRecord: (websiteId: string, record: Omit<WebsiteManagement, "id" | "websiteId">) => void;
  updateManagementRecord: (websiteId: string, recordId: string, updatedRecord: Partial<WebsiteManagement>) => void;
  deleteWebsite: (id: string) => void;
  deleteManagementRecord: (websiteId: string, recordId: string) => void;
  clearAllManagementRecords: (websiteId: string) => void;
  updateWebsite: (website: Website) => void;
}
