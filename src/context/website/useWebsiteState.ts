import { useState, useEffect } from "react";
import { Website, WebsiteManagement } from "./types";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../AuthContext";
import { supabase } from "@/lib/supabaseClient";

export const useWebsiteState = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const { user } = useAuth();

  // Load websites from Supabase
  useEffect(() => {
    if (!user) return;
    fetchWebsites();
    // eslint-disable-next-line
  }, [user]);

  const fetchWebsites = async () => {
    if (!user) return;
    const { data: websitesData, error: websitesError } = await supabase
      .from("websites")
      .select("*");
    if (websitesError) {
      toast.error("Failed to fetch websites");
      return;
    }
    // Fetch all management records
    const { data: managementData, error: managementError } = await supabase
      .from("website_management")
      .select("*");
    if (managementError) {
      toast.error("Failed to fetch management records");
      setWebsites(websitesData || []);
      return;
    }
    // Attach managementData to each website
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
  };

  // Get websites for the current user
  const getUserWebsites = () => {
    if (!user) return [];
    return websites.filter((site) => site.userid === user.id);
  };

  // Get all websites (for admin)
  const getAllWebsites = () => websites;

  // Add a new website
  const addWebsite = async (
    website: Omit<
      Website,
      "id" | "userid" | "status" | "managementData" | "createdat" | "updatedat"
    >
  ) => {
    if (!user) return;

    const now = new Date().toISOString();
    // Serialize files property if present
    let files = undefined;
    if (website.files) {
      files = JSON.stringify(website.files);
    }
    const newWebsite: Website = {
      ...website,
      id: `website-${Date.now()}`,
      userid: user.id,
      useremail: user.email,
      status: "pending",
      managementData: [],
      createdat: now,
      updatedat: now,
      type: website.type || "website",
      ...(files ? { files } : {}),
    };

    const { error } = await supabase
      .from("websites")
      .insert([{ ...newWebsite, files: files ? files : null }]);
    if (error) {
      toast.error(`Failed to add website: ${error.message}`);
      return;
    }
    await fetchWebsites();
    toast.success("Website submitted for approval");
  };

  // Update website status
  const updateWebsiteStatus = async (
    id: string,
    status: Website["status"],
    rejectionReason?: string
  ) => {
    const { error } = await supabase
      .from("websites")
      .update({
        status,
        rejectionReason: status === "rejected" ? rejectionReason : null,
        updatedat: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update website status");
      return;
    }
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
  };

  // Update an entire website
  const updateWebsite = async (updatedWebsite: Website) => {
    const { error } = await supabase
      .from("websites")
      .update({ ...updatedWebsite, updatedat: new Date().toISOString() })
      .eq("id", updatedWebsite.id);
    if (error) {
      toast.error("Failed to update website");
      return;
    }
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
  };

  // Add management record
  const addManagementRecord = async (
    websiteId: string,
    record: Omit<WebsiteManagement, "id" | "website_id">
  ) => {
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
      console.error(error);
      toast.error(`Failed to add management record: ${error.message}`);
      return;
    }

    setWebsites((prev) =>
      prev.map((website) =>
        website.id === websiteId
          ? {
              ...website,
              managementData: [...website.managementData, newRecord],
            }
          : website
      )
    );

    toast.success("Management record added");
  };

  // Update management record
  const updateManagementRecord = async (
    websiteId: string,
    recordId: string,
    updatedRecord: Partial<WebsiteManagement>
  ) => {
    const { error } = await supabase
      .from("website_management")
      .update(updatedRecord)
      .eq("id", recordId)
      .eq("website_id", websiteId);
    if (error) {
      toast.error("Failed to update management record");
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
  };

  // Delete website
  const deleteWebsite = async (id: string) => {
    const { error } = await supabase.from("websites").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete website");
      return;
    }
    setWebsites((prev) => prev.filter((website) => website.id !== id));
    toast.success("Website deleted successfully");
  };

  // Delete management record
  const deleteManagementRecord = async (
    websiteId: string,
    recordId: string
  ) => {
    const { error } = await supabase
      .from("website_management")
      .delete()
      .eq("id", recordId)
      .eq("website_id", websiteId);
    if (error) {
      toast.error("Failed to delete management record");
      return;
    }
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
  };

  // Clear all management records for a website
  const clearAllManagementRecords = async (websiteId: string) => {
    const { error } = await supabase
      .from("website_management")
      .delete()
      .eq("website_id", websiteId);
    if (error) {
      toast.error("Failed to clear management records");
      return;
    }
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
    clearAllManagementRecords,
  };
};
