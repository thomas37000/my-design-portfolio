import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DisplayMode = "gallery" | "grid";

interface DisplayModeSettings {
  projects: DisplayMode;
}

export function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("gallery");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisplayMode();
  }, []);

  async function fetchDisplayMode() {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "display_mode")
        .single();

      if (error) {
        console.error("Error fetching display mode:", error);
      } else if (data) {
        const settings = data.value as unknown as DisplayModeSettings;
        setDisplayMode(settings?.projects || "gallery");
      }
    } catch (error) {
      console.error("Error fetching display mode:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateDisplayMode(mode: DisplayMode) {
    try {
      const { error } = await supabase
        .from("settings")
        .update({ value: { projects: mode } })
        .eq("key", "display_mode");

      if (error) throw error;
      setDisplayMode(mode);
      return true;
    } catch (error) {
      console.error("Error updating display mode:", error);
      return false;
    }
  }

  return { displayMode, loading, updateDisplayMode, refetch: fetchDisplayMode };
}
