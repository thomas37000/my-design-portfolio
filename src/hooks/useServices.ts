import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
  technos: string[];
  display_order: number;
}

export type ServiceInput = Omit<Service, "id">;

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(
        (data ?? []).map((s: any) => ({
          id: s.id,
          title: s.title,
          price: s.price,
          description: s.description,
          icon: s.icon,
          features: Array.isArray(s.features) ? s.features : [],
          technos: Array.isArray(s.technos) ? s.technos : [],
          display_order: s.display_order,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (input: ServiceInput) => {
    const { error } = await supabase.from("services").insert([input]);
    if (error) throw error;
    await fetchServices();
  };

  const updateService = async (id: string, input: Partial<ServiceInput>) => {
    const { error } = await supabase.from("services").update(input).eq("id", id);
    if (error) throw error;
    await fetchServices();
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    await fetchServices();
  };

  return { services, loading, refetch: fetchServices, createService, updateService, deleteService };
};
