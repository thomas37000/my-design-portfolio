import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ProjectOrder = "design-first" | "dev-first";

interface ProjectOrderSettings {
  order: ProjectOrder;
}

export function useProjectOrder() {
  const [projectOrder, setProjectOrder] = useState<ProjectOrder>("design-first");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectOrder();
  }, []);

  async function fetchProjectOrder() {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "project_order")
        .maybeSingle();

      if (!error && data) {
        const settings = data.value as unknown as ProjectOrderSettings;
        setProjectOrder(settings?.order || "design-first");
      }
    } catch (error) {
      console.error("Error fetching project order:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProjectOrder(order: ProjectOrder) {
    try {
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("key", "project_order")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("settings")
          .update({ value: { order } })
          .eq("key", "project_order");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("settings")
          .insert({ key: "project_order", value: { order } });
        if (error) throw error;
      }

      setProjectOrder(order);
      return true;
    } catch (error) {
      console.error("Error updating project order:", error);
      return false;
    }
  }

  return { projectOrder, loading, updateProjectOrder, refetch: fetchProjectOrder };
}
