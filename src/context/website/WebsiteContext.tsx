
import { createContext, useContext, ReactNode } from "react";
import { WebsiteContextType } from "./types";
import { useWebsiteState } from "./useWebsiteState";

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
  const websiteState = useWebsiteState();
  
  return (
    <WebsiteContext.Provider value={websiteState}>
      {children}
    </WebsiteContext.Provider>
  );
};
