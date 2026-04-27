import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SETTING_KEY = "custom_skill_categories";

export const useCustomCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();

    if (!error && data?.value && Array.isArray((data.value as any).categories)) {
      setCategories((data.value as any).categories);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string): Promise<boolean> => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    if (categories.includes(trimmed)) {
      toast({
        title: "Catégorie déjà existante",
        variant: "destructive",
      });
      return false;
    }

    const next = [...categories, trimmed];

    const { error } = await supabase
      .from("settings")
      .upsert(
        { key: SETTING_KEY, value: { categories: next } as any },
        { onConflict: "key" }
      );

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive",
      });
      return false;
    }

    setCategories(next);
    toast({ title: "Catégorie ajoutée" });
    return true;
  };

  return { categories, loading, addCategory, refetch: fetchCategories };
};
