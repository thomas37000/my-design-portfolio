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

  const deleteCategory = async (name: string): Promise<boolean> => {
    // Supprime toutes les compétences liées à cette catégorie
    const { error: skillsError } = await supabase
      .from("skills")
      .delete()
      .eq("category", name);

    if (skillsError) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les compétences liées",
        variant: "destructive",
      });
      return false;
    }

    // Retire la catégorie de la liste personnalisée (si présente)
    const next = categories.filter((c) => c !== name);
    if (next.length !== categories.length) {
      const { error } = await supabase
        .from("settings")
        .upsert(
          { key: SETTING_KEY, value: { categories: next } as any },
          { onConflict: "key" }
        );

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la catégorie",
          variant: "destructive",
        });
        return false;
      }
      setCategories(next);
    }

    toast({ title: "Catégorie supprimée" });
    return true;
  };

  return { categories, loading, addCategory, deleteCategory, refetch: fetchCategories };
};
