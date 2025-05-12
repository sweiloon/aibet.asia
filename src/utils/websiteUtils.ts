
import { Website, WebsiteManagement } from "@/types/website";
import { toast } from "@/components/ui/sonner";

// Add a new website
export const addWebsiteUtil = (
  websites: Website[],
  website: Omit<Website, "id" | "userId" | "status" | "managementData" | "createdAt">,
  userId: string,
  userEmail?: string
): Website[] => {
  const now = new Date().toISOString();
  const newWebsite: Website = {
    ...website,
    id: `website-${Date.now()}`,
    userId: userId,
    userEmail: userEmail,
    status: "pending",
    managementData: [],
    createdAt: now,
    updatedAt: now,
    type: website.type || "website"
  };
  
  toast.success("Website submitted for approval");
  return [...websites, newWebsite];
};

// Update website status
export const updateWebsiteStatusUtil = (
  websites: Website[],
  id: string, 
  status: Website["status"], 
  rejectionReason?: string
): Website[] => {
  const updatedWebsites = websites.map(website => 
    website.id === id ? { 
      ...website, 
      status,
      rejectionReason: status === "rejected" ? rejectionReason : undefined,
      updatedAt: new Date().toISOString()
    } : website
  );
  
  toast.success(`Website status updated to ${status}`);
  return updatedWebsites;
};

// Update an entire website
export const updateWebsiteUtil = (
  websites: Website[],
  updatedWebsite: Website
): Website[] => {
  const updatedWebsites = websites.map(website => 
    website.id === updatedWebsite.id ? {
      ...updatedWebsite,
      updatedAt: new Date().toISOString()
    } : website
  );
  
  toast.success("Website updated successfully");
  return updatedWebsites;
};

// Add management record
export const addManagementRecordUtil = (
  websites: Website[],
  websiteId: string, 
  record: Omit<WebsiteManagement, "id" | "websiteId">
): Website[] => {
  const newRecord: WebsiteManagement = {
    ...record,
    id: `record-${Date.now()}`,
    websiteId
  };
  
  const updatedWebsites = websites.map(website => 
    website.id === websiteId 
      ? { ...website, managementData: [...website.managementData, newRecord] }
      : website
  );
  
  toast.success("Management record added");
  return updatedWebsites;
};

// Update management record
export const updateManagementRecordUtil = (
  websites: Website[],
  websiteId: string, 
  recordId: string, 
  updatedRecord: Partial<WebsiteManagement>
): Website[] => {
  const updatedWebsites = websites.map(website => 
    website.id === websiteId 
      ? { 
          ...website, 
          managementData: website.managementData.map(record => 
            record.id === recordId 
              ? { ...record, ...updatedRecord }
              : record
          )
        }
      : website
  );
  
  toast.success("Management record updated");
  return updatedWebsites;
};

// Delete website
export const deleteWebsiteUtil = (
  websites: Website[],
  id: string
): Website[] => {
  const updatedWebsites = websites.filter(website => website.id !== id);
  toast.success("Website deleted successfully");
  return updatedWebsites;
};

// Delete management record
export const deleteManagementRecordUtil = (
  websites: Website[],
  websiteId: string, 
  recordId: string
): Website[] => {
  const updatedWebsites = websites.map(website => 
    website.id === websiteId 
      ? { 
          ...website, 
          managementData: website.managementData.filter(record => record.id !== recordId)
        }
      : website
  );
  
  toast.success("Management record deleted");
  return updatedWebsites;
};

// Clear all management records for a website
export const clearAllManagementRecordsUtil = (
  websites: Website[],
  websiteId: string
): Website[] => {
  const updatedWebsites = websites.map(website => 
    website.id === websiteId 
      ? { 
          ...website, 
          managementData: []
        }
      : website
  );
  
  toast.success("All management records cleared");
  return updatedWebsites;
};
