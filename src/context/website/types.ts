export type WebsiteStatus = "pending" | "approved" | "rejected";
export type WebsiteType = "website" | "app" | "other";

export interface WebsiteFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
}

export interface WebsiteTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface WebsiteManagement {
  id: string;
  website_id: string;
  day: string;
  credit: number;
  profit: number;
  gross_profit: number;
  net_profit: number;
  service_fee: number;
  start_date: string;
  end_date: string;
  tasks?: WebsiteTask[];
}

export interface Website {
  id: string;
  name: string;
  description?: string;
  type: WebsiteType;
  domain?: string;
  url?: string;
  hosting?: string;
  hostingCredentials?: { username: string; password: string };
  adminUrl?: string;
  adminCredentials?: { username: string; password: string };
  other?: string;
  status: WebsiteStatus;
  rejectionReason?: string;
  createdat: string;
  updatedat: string;
  userid: string;
  useremail: string;
  files?: WebsiteFile[];
  managementData: WebsiteManagement[];
}

export interface WebsiteContextType {
  websites: Website[];
  isLoading: boolean;
  error: string | null;
  getUserWebsites: () => Website[];
  getAllWebsites: () => Website[];
  addWebsite: (
    website: Omit<
      Website,
      "id" | "userid" | "status" | "managementData" | "createdat" | "updatedat"
    >
  ) => void;
  updateWebsiteStatus: (
    id: string,
    status: WebsiteStatus,
    rejectionReason?: string
  ) => void;
  updateWebsite: (website: Website) => void;
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
}
