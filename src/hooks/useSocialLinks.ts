import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string; // Lucide icon name
}

// Legacy shape kept for backward compatibility during migration
interface LegacyLinks {
  linkedin?: string;
  github?: string;
  email?: string;
}

const migrateLegacy = (legacy: LegacyLinks): SocialLink[] => {
  const items: SocialLink[] = [];
  if (legacy.linkedin) items.push({ id: crypto.randomUUID(), label: "LinkedIn", url: legacy.linkedin, icon: "Linkedin" });
  if (legacy.github) items.push({ id: crypto.randomUUID(), label: "GitHub", url: legacy.github, icon: "Github" });
  if (legacy.email) items.push({ id: crypto.randomUUID(), label: "Email", url: `mailto:${legacy.email}`, icon: "Mail" });
  return items;
};

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
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
        const value = data.value as unknown;
        if (Array.isArray(value)) {
          setLinks(value as SocialLink[]);
        } else if (value && typeof value === "object") {
          setLinks(migrateLegacy(value as LegacyLinks));
        }
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

  const updateLinks = async (newLinks: SocialLink[]): Promise<boolean> => {
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
