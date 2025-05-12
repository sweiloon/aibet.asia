
import { useState, useEffect } from "react";
import { Website } from "@/types/website";

export const useWebsitesState = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  
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

  return { websites, setWebsites };
};
