
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Website, WebsiteContextType, WebsiteManagement } from "@/types/website";
import { useWebsiteUtils } from "@/hooks/useWebsiteUtils";
import { useWebsitesState } from "@/hooks/useWebsitesState";

// Re-export types for backward compatibility
export type { Website, WebsiteManagement, WebsiteContextType };

// Create context with default values
const WebsiteContext = createContext<WebsiteContextType>({
  websites: [],
  getUserWebsites: () => [],
  getAllWebsites: () => [],
  addWebsite: () => {},
  updateWebsiteStatus: () => {},
  addManagementRecord: () => {},
  updateManagementRecord: () => {},
  deleteWebsite: () => {},
  deleteManagementRecord: () => {},
  clearAllManagementRecords: () => {},
  updateWebsite: () => {},
});

// Custom hook to use the website context
export const useWebsites = () => useContext(WebsiteContext);

// Provider component
export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const { websites, setWebsites } = useWebsitesState();
  const { user } = useAuth();
  const { 
    addWebsiteUtil,
    updateWebsiteStatusUtil,
    updateWebsiteUtil,
    addManagementRecordUtil,
    updateManagementRecordUtil,
    deleteWebsiteUtil,
    deleteManagementRecordUtil,
    clearAllManagementRecordsUtil 
  } = useWebsiteUtils();
  
  // Get websites for the current user
  const getUserWebsites = () => {
    if (!user) return [];
    return websites.filter(site => site.userId === user.id);
  };
  
  // Get all websites (for admin)
  const getAllWebsites = () => websites;
  
  // Add a new website
  const addWebsite = (website: Omit<Website, "id" | "userId" | "status" | "managementData" | "createdAt">) => {
    if (!user) return;
    setWebsites(prev => addWebsiteUtil(prev, website, user.id, user.email));
  };
  
  // Update website status
  const updateWebsiteStatus = (id: string, status: Website["status"], rejectionReason?: string) => {
    setWebsites(prev => updateWebsiteStatusUtil(prev, id, status, rejectionReason));
  };
  
  // Update an entire website
  const updateWebsite = (updatedWebsite: Website) => {
    setWebsites(prev => updateWebsiteUtil(prev, updatedWebsite));
  };
  
  // Add management record
  const addManagementRecord = (websiteId: string, record: Omit<WebsiteManagement, "id" | "websiteId">) => {
    setWebsites(prev => addManagementRecordUtil(prev, websiteId, record));
  };
  
  // Update management record
  const updateManagementRecord = (websiteId: string, recordId: string, updatedRecord: Partial<WebsiteManagement>) => {
    setWebsites(prev => updateManagementRecordUtil(prev, websiteId, recordId, updatedRecord));
  };
  
  // Delete website
  const deleteWebsite = (id: string) => {
    setWebsites(prev => deleteWebsiteUtil(prev, id));
  };
  
  // Delete management record
  const deleteManagementRecord = (websiteId: string, recordId: string) => {
    setWebsites(prev => deleteManagementRecordUtil(prev, websiteId, recordId));
  };
  
  // Clear all management records for a website
  const clearAllManagementRecords = (websiteId: string) => {
    setWebsites(prev => clearAllManagementRecordsUtil(prev, websiteId));
  };
  
  return (
    <WebsiteContext.Provider value={{
      websites,
      getUserWebsites,
      getAllWebsites,
      addWebsite,
      updateWebsiteStatus,
      addManagementRecord,
      updateManagementRecord,
      deleteWebsite,
      deleteManagementRecord,
      clearAllManagementRecords,
      updateWebsite
    }}>
      {children}
    </WebsiteContext.Provider>
  );
};
