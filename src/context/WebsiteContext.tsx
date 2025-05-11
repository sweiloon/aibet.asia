
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";

export interface Website {
  id: string;
  userId: string;
  name: string;
  url: string;
  loginUrl?: string;
  username?: string;
  password?: string;
  status: "pending" | "approved" | "rejected";
  managementData: WebsiteManagement[];
  createdAt: string;
}

export interface WebsiteManagement {
  id: string;
  websiteId: string;
  date: string;
  tasks: {
    type: string;
    description: string;
    status: "completed" | "in-progress" | "pending";
  }[];
}

interface WebsiteContextType {
  websites: Website[];
  getUserWebsites: () => Website[];
  getAllWebsites: () => Website[];
  addWebsite: (website: Omit<Website, "id" | "userId" | "status" | "managementData" | "createdAt">) => void;
  updateWebsiteStatus: (id: string, status: Website["status"]) => void;
  addManagementRecord: (websiteId: string, record: Omit<WebsiteManagement, "id" | "websiteId">) => void;
  updateManagementRecord: (websiteId: string, recordId: string, tasks: WebsiteManagement["tasks"]) => void;
  deleteWebsite: (id: string) => void;
  deleteManagementRecord: (websiteId: string, recordId: string) => void;
}

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
});

export const useWebsites = () => useContext(WebsiteContext);

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const { user } = useAuth();
  
  // Load websites from local storage
  useEffect(() => {
    const storedWebsites = localStorage.getItem('websites');
    if (storedWebsites) {
      setWebsites(JSON.parse(storedWebsites));
    }
  }, []);
  
  // Save websites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('websites', JSON.stringify(websites));
  }, [websites]);
  
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
    
    const newWebsite: Website = {
      ...website,
      id: `website-${Date.now()}`,
      userId: user.id,
      status: "pending",
      managementData: [],
      createdAt: new Date().toISOString()
    };
    
    setWebsites(prev => [...prev, newWebsite]);
    toast.success("Website submitted for approval");
  };
  
  // Update website status
  const updateWebsiteStatus = (id: string, status: Website["status"]) => {
    setWebsites(prev => prev.map(website => 
      website.id === id ? { ...website, status } : website
    ));
    toast.success(`Website status updated to ${status}`);
  };
  
  // Add management record
  const addManagementRecord = (websiteId: string, record: Omit<WebsiteManagement, "id" | "websiteId">) => {
    const newRecord: WebsiteManagement = {
      ...record,
      id: `record-${Date.now()}`,
      websiteId
    };
    
    setWebsites(prev => prev.map(website => 
      website.id === websiteId 
        ? { ...website, managementData: [...website.managementData, newRecord] }
        : website
    ));
    
    toast.success("Management record added");
  };
  
  // Update management record
  const updateManagementRecord = (websiteId: string, recordId: string, tasks: WebsiteManagement["tasks"]) => {
    setWebsites(prev => prev.map(website => 
      website.id === websiteId 
        ? { 
            ...website, 
            managementData: website.managementData.map(record => 
              record.id === recordId 
                ? { ...record, tasks }
                : record
            )
          }
        : website
    ));
    
    toast.success("Management record updated");
  };
  
  // Delete website
  const deleteWebsite = (id: string) => {
    setWebsites(prev => prev.filter(website => website.id !== id));
    toast.success("Website deleted successfully");
  };
  
  // Delete management record
  const deleteManagementRecord = (websiteId: string, recordId: string) => {
    setWebsites(prev => prev.map(website => 
      website.id === websiteId 
        ? { 
            ...website, 
            managementData: website.managementData.filter(record => record.id !== recordId)
          }
        : website
    ));
    
    toast.success("Management record deleted");
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
      deleteManagementRecord
    }}>
      {children}
    </WebsiteContext.Provider>
  );
};
