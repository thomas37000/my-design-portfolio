import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLinks {
  linkedin: string;
  github: string;
  email: string;
}

const defaultLinks: SocialLinks = {
  linkedin: "",
  github: "",
  email: "",
};

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "social_links")
        .maybeSingle();

      if (error) throw error;
      if (data?.value) {
        setLinks({ ...defaultLinks, ...(data.value as unknown as SocialLinks) });
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const updateLinks = async (newLinks: SocialLinks): Promise<boolean> => {
    try {
      const { error } = await supabase.from("settings").upsert(
        [
          {
            key: "social_links",
            value: JSON.parse(JSON.stringify(newLinks)),
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "key" }
      );
      if (error) throw error;
      setLinks(newLinks);
      return true;
    } catch (error) {
      console.error("Error updating social links:", error);
      return false;
    }
  };

  return { links, loading, updateLinks, refetch: fetchLinks };
};
