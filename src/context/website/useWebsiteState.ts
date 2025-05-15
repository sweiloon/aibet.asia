import { useState, useEffect, useCallback } from "react";
import { Website, WebsiteManagement } from "./types";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../AuthContext";
import { supabase } from "@/lib/supabaseClient";

export const useWebsiteState = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch websites with better error handling and retry mechanism
  const fetchWebsites = useCallback(
    async (retryCount = 0) => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get websites data
        const { data: websitesData, error: websitesError } = await supabase
          .from("websites")
          .select("*");

        if (websitesError) {
          console.error("Failed to fetch websites:", websitesError);

          // If we have authentication errors, don't retry
          if (
            websitesError.code === "PGRST301" ||
            websitesError.code === "401"
          ) {
            setError("Authentication error. Please log in again.");
            return;
          }

          // Retry logic for transient errors
          if (retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying fetchWebsites in ${delay}ms...`);
            setTimeout(() => fetchWebsites(retryCount + 1), delay);
            return;
          }

          toast.error(
            "Failed to fetch websites. Please try refreshing the page."
          );
          setError(websitesError.message);
          return;
        }

        // Get management records
        const { data: managementData, error: managementError } = await supabase
          .from("website_management")
          .select("*");

        if (managementError) {
          console.error("Failed to fetch management records:", managementError);

          // Still allow website data to be displayed
          const websitesWithoutManagement = (websitesData || []).map((site) => {
            let files = site.files;
            if (typeof files === "string") {
              try {
                files = JSON.parse(files);
              } catch {
                files = [];
              }
            }
            return {
              ...site,
              files,
              managementData: [],
            };
          });

          setWebsites(websitesWithoutManagement);
          toast.error("Some website data could not be loaded completely.");
          return;
        }

        // Combine websites with management data
        const websitesWithManagement = (websitesData || []).map((site) => {
          let files = site.files;
          if (typeof files === "string") {
            try {
              files = JSON.parse(files);
            } catch {
              files = [];
            }
          }
          return {
            ...site,
            files,
            managementData: (managementData || []).filter(
              (m) => m.website_id === site.id
            ),
          };
        });

        setWebsites(websitesWithManagement);
      } catch (err) {
        console.error("Unexpected error in fetchWebsites:", err);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to load websites data");
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // Load websites on user change
  useEffect(() => {
    if (user) {
      fetchWebsites();
    } else {
      // Clear websites when user logs out
      setWebsites([]);
    }
  }, [user, fetchWebsites]);

  // Get websites for the current user
  const getUserWebsites = useCallback(() => {
    if (!user) return [];
    return websites.filter((site) => site.userid === user.id);
  }, [websites, user]);

  // Get all websites (for admin)
  const getAllWebsites = useCallback(() => websites, [websites]);

  // Add a new website with better error handling
  const addWebsite = async (
    website: Omit<
      Website,
      "id" | "userid" | "status" | "managementData" | "createdat" | "updatedat"
    >
  ) => {
    if (!user) {
      toast.error("You must be logged in to add a website");
      return;
    }

    try {
      setIsLoading(true);
      const now = new Date().toISOString();

      // Serialize files property if present
      let files = undefined;
      if (website.files) {
        files = JSON.stringify(website.files);
      }

      // Utility to omit managementData if present
      function omitManagementData<T extends object>(
        obj: T
      ): Omit<T, "managementData"> {
        const { managementData, ...rest } = obj as Record<string, unknown>;
        return rest as Omit<T, "managementData">;
      }

      const websiteData = omitManagementData({
        ...website,
        id: `website-${Date.now()}`,
        userid: user.id,
        useremail: user.email,
        status: "pending",
        createdat: now,
        updatedat: now,
        type: website.type || "website",
        files: files ? files : null,
      });

      const { error } = await supabase.from("websites").insert([websiteData]);

      if (error) {
        console.error("Failed to add website:", error);
        toast.error(`Failed to add website: ${error.message}`);
        return;
      }

      await fetchWebsites();
      toast.success("Website submitted for approval");
    } catch (err) {
      console.error("Unexpected error in addWebsite:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update website status with error handling
  const updateWebsiteStatus = async (
    id: string,
    status: Website["status"],
    rejectionReason?: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to update website status");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("websites")
        .update({
          status,
          rejectionReason: status === "rejected" ? rejectionReason : null,
          updatedat: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Failed to update website status:", error);
        toast.error(`Failed to update website status: ${error.message}`);
        return;
      }

      // Update local state
      setWebsites((prev) =>
        prev.map((website) =>
          website.id === id
            ? {
                ...website,
                status,
                rejectionReason:
                  status === "rejected" ? rejectionReason : undefined,
                updatedat: new Date().toISOString(),
              }
            : website
        )
      );

      toast.success(`Website status updated to ${status}`);
    } catch (err) {
      console.error("Unexpected error in updateWebsiteStatus:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an entire website
  const updateWebsite = async (updatedWebsite: Website) => {
    if (!user) {
      toast.error("You must be logged in to update website details");
      return;
    }

    try {
      setIsLoading(true);
      const { managementData, ...websiteData } = updatedWebsite;

      const { error } = await supabase
        .from("websites")
        .update({ ...websiteData, updatedat: new Date().toISOString() })
        .eq("id", updatedWebsite.id);

      if (error) {
        console.error("Failed to update website:", error);
        toast.error(`Failed to update website: ${error.message}`);
        return;
      }

      // Update local state
      setWebsites((prev) =>
        prev.map((website) =>
          website.id === updatedWebsite.id
            ? {
                ...updatedWebsite,
                updatedat: new Date().toISOString(),
              }
            : website
        )
      );

      toast.success("Website updated successfully");
    } catch (err) {
      console.error("Unexpected error in updateWebsite:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add management record
  const addManagementRecord = async (
    websiteId: string,
    record: Omit<WebsiteManagement, "id" | "website_id">
  ) => {
    if (!user) {
      toast.error("You must be logged in to add management records");
      return;
    }

    try {
      setIsLoading(true);

      // Ensure all required fields are present and types are correct
      const newRecord = {
        id: `record-${Date.now()}`,
        website_id: websiteId,
        day: record.day || "Day 1",
        credit: Number(record.credit) || 0,
        profit: Number(record.profit) || 0,
        gross_profit: Number(record.gross_profit) || 0,
        service_fee: Number(record.service_fee) || 0,
        start_date: record.start_date
          ? new Date(record.start_date).toISOString()
          : new Date().toISOString(),
        end_date: record.end_date
          ? new Date(record.end_date).toISOString()
          : new Date().toISOString(),
        net_profit: Number(record.net_profit) || 0,
        tasks: record.tasks || [],
      };

      const { error } = await supabase
        .from("website_management")
        .insert([newRecord]);

      if (error) {
        console.error("Failed to add management record:", error);
        toast.error(`Failed to add management record: ${error.message}`);
        return;
      }

      // Update local state
      setWebsites((prev) =>
        prev.map((website) =>
          website.id === websiteId
            ? {
                ...website,
                managementData: [newRecord, ...website.managementData],
              }
            : website
        )
      );

      toast.success("Management record added");
    } catch (err) {
      console.error("Unexpected error in addManagementRecord:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete website
  const deleteWebsite = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete websites");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.from("websites").delete().eq("id", id);

      if (error) {
        console.error("Failed to delete website:", error);
        toast.error(`Failed to delete website: ${error.message}`);
        return;
      }

      // Update local state
      setWebsites((prev) => prev.filter((website) => website.id !== id));
      toast.success("Website deleted successfully");
    } catch (err) {
      console.error("Unexpected error in deleteWebsite:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete management record
  const deleteManagementRecord = async (
    websiteId: string,
    recordId: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to delete management records");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("website_management")
        .delete()
        .eq("id", recordId)
        .eq("website_id", websiteId);

      if (error) {
        console.error("Failed to delete management record:", error);
        toast.error(`Failed to delete management record: ${error.message}`);
        return;
      }

      // Update local state
      setWebsites((prev) =>
        prev.map((website) =>
          website.id === websiteId
            ? {
                ...website,
                managementData: website.managementData.filter(
                  (record) => record.id !== recordId
                ),
              }
            : website
        )
      );

      toast.success("Management record deleted");
    } catch (err) {
      console.error("Unexpected error in deleteManagementRecord:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all management records for a website
  const clearAllManagementRecords = async (websiteId: string) => {
    if (!user) {
      toast.error("You must be logged in to clear management records");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("website_management")
        .delete()
        .eq("website_id", websiteId);

      if (error) {
        console.error("Failed to clear management records:", error);
        toast.error(`Failed to clear management records: ${error.message}`);
        return;
      }

      // Update local state
      setWebsites((prev) =>
        prev.map((website) =>
          website.id === websiteId
            ? {
                ...website,
                managementData: [],
              }
            : website
        )
      );

      toast.success("All management records cleared");
    } catch (err) {
      console.error("Unexpected error in clearAllManagementRecords:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    websites,
    isLoading,
    error,
    getUserWebsites,
    getAllWebsites,
    addWebsite,
    updateWebsiteStatus,
    updateWebsite,
    addManagementRecord,
    updateManagementRecord: async (websiteId, recordId, updatedRecord) => {
      if (!user) {
        toast.error("You must be logged in to update records");
        return;
      }
      try {
        const { error } = await supabase
          .from("website_management")
          .update(updatedRecord)
          .eq("id", recordId)
          .eq("website_id", websiteId);
        if (error) {
          toast.error(`Failed to update record: ${error.message}`);
          return;
        }
        setWebsites((prev) =>
          prev.map((website) =>
            website.id === websiteId
              ? {
                  ...website,
                  managementData: website.managementData.map((record) =>
                    record.id === recordId
                      ? { ...record, ...updatedRecord }
                      : record
                  ),
                }
              : website
          )
        );
        toast.success("Management record updated");
      } catch (err) {
        toast.error("An unexpected error occurred");
      }
    },
    deleteWebsite,
    deleteManagementRecord,
    clearAllManagementRecords,
  };
};
