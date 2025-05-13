export interface WebsiteManagement {
  id: string;
  website_id: string;
  day: string;
  credit: number;
  profit: number;
  gross_profit: number;
  service_fee: number;
  start_date: string;
  end_date: string;
  net_profit: number;
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
  userid: string;
  useremail?: string;
  name: string;
  url: string;
  loginUrl?: string;
  username?: string;
  password?: string;
  status: "pending" | "approved" | "rejected";
  managementData: WebsiteManagement[];
  createdat: string;
  updatedat?: string;
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
  addWebsite: (
    website: Omit<
      Website,
      "id" | "userid" | "status" | "managementData" | "createdat"
    >
  ) => void;
  updateWebsiteStatus: (
    id: string,
    status: Website["status"],
    rejectionReason?: string
  ) => void;
  addManagementRecord: (
    websiteId: string,
    record: Omit<WebsiteManagement, "id" | "website_id">
  ) => void;
  updateManagementRecord: (
    websiteId: string,
    recordId: string,
    updatedRecord: Partial<WebsiteManagement>
  ) => void;
  deleteWebsite: (id: string) => void;
  deleteManagementRecord: (websiteId: string, recordId: string) => void;
  clearAllManagementRecords: (websiteId: string) => void;
  updateWebsite: (website: Website) => void;
}
