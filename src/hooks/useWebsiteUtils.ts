
import { 
  addWebsiteUtil,
  updateWebsiteStatusUtil,
  updateWebsiteUtil,
  addManagementRecordUtil,
  updateManagementRecordUtil,
  deleteWebsiteUtil,
  deleteManagementRecordUtil,
  clearAllManagementRecordsUtil 
} from "@/utils/websiteUtils";

export const useWebsiteUtils = () => {
  return {
    addWebsiteUtil,
    updateWebsiteStatusUtil,
    updateWebsiteUtil,
    addManagementRecordUtil,
    updateManagementRecordUtil,
    deleteWebsiteUtil,
    deleteManagementRecordUtil,
    clearAllManagementRecordsUtil
  };
};
