
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User } from "@/types/auth.types";

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // Initialize auth state from Supabase
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        // Update user state after session change
        if (currentSession?.user) {
          // Fetch user profile to get the role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              role: profile.role as "user" | "admin"
            });
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Fetch user profile to get role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            role: profile.role as "user" | "admin"
          });
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    setLoading
  };
};
