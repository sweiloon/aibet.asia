
import { useState, useEffect } from 'react';
import { Website } from './types';
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../AuthContext";

export const useWebsiteState = () => {
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
    
    const now = new Date().toISOString();
    const newWebsite: Website = {
      ...website,
      id: `website-${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      status: "pending",
      managementData: [],
      createdAt: now,
      updatedAt: now,
      type: website.type || "website"
    };
    
    setWebsites(prev => [...prev, newWebsite]);
    toast.success("Website submitted for approval");
  };
  
  // Update website status
  const updateWebsiteStatus = (id: string, status: Website["status"], rejectionReason?: string) => {
    setWebsites(prev => prev.map(website => 
      website.id === id ? { 
        ...website, 
        status,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
        updatedAt: new Date().toISOString()
      } : website
    ));
    toast.success(`Website status updated to ${status}`);
  };
  
  // Update an entire website
  const updateWebsite = (updatedWebsite: Website) => {
    setWebsites(prev => prev.map(website => 
      website.id === updatedWebsite.id ? {
        ...updatedWebsite,
        updatedAt: new Date().toISOString()
      } : website
    ));
    toast.success("Website updated successfully");
  };
  
  // Add management record
  const addManagementRecord = (websiteId: string, record: Omit<Website["managementData"][0], "id" | "websiteId">) => {
    const newRecord = {
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
  const updateManagementRecord = (websiteId: string, recordId: string, updatedRecord: Partial<Website["managementData"][0]>) => {
    setWebsites(prev => prev.map(website => 
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
  
  // Clear all management records for a website
  const clearAllManagementRecords = (websiteId: string) => {
    setWebsites(prev => prev.map(website => 
      website.id === websiteId 
        ? { 
            ...website, 
            managementData: []
          }
        : website
    ));
    
    toast.success("All management records cleared");
  };

  return {
    websites,
    getUserWebsites,
    getAllWebsites,
    addWebsite,
    updateWebsiteStatus,
    updateWebsite,
    addManagementRecord,
    updateManagementRecord,
    deleteWebsite,
    deleteManagementRecord,
    clearAllManagementRecords
  };
};
