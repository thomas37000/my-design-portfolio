import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SETTING_KEY = "custom_skill_categories";

export interface CategoryMeta {
  name: string;
  icon?: string | null;
}

const parseValue = (value: any): CategoryMeta[] => {
  if (!value) return [];
  const arr = Array.isArray(value.categories) ? value.categories : [];
  return arr
    .map((c: any) =>
      typeof c === "string" ? { name: c, icon: null } : { name: c.name, icon: c.icon ?? null }
    )
    .filter((c: CategoryMeta) => !!c.name);
};

export const useCustomCategories = () => {
  const [categoriesMeta, setCategoriesMeta] = useState<CategoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();

    if (!error && data?.value) {
      setCategoriesMeta(parseValue(data.value));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const persist = async (next: CategoryMeta[]): Promise<boolean> => {
    const { error } = await supabase
      .from("settings")
      .upsert(
        { key: SETTING_KEY, value: { categories: next } as any },
        { onConflict: "key" }
      );
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer", variant: "destructive" });
      return false;
    }
    setCategoriesMeta(next);
    return true;
  };

  const addCategory = async (name: string, icon?: string): Promise<boolean> => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    if (categoriesMeta.some((c) => c.name === trimmed)) {
      toast({ title: "Catégorie déjà existante", variant: "destructive" });
      return false;
    }

    const ok = await persist([...categoriesMeta, { name: trimmed, icon: icon?.trim() || null }]);
    if (ok) toast({ title: "Catégorie ajoutée" });
    return ok;
  };

  const updateCategory = async (
    oldName: string,
    newName: string,
    icon: string | null
  ): Promise<boolean> => {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    if (trimmed !== oldName && categoriesMeta.some((c) => c.name === trimmed)) {
      toast({ title: "Une catégorie avec ce nom existe déjà", variant: "destructive" });
      return false;
    }

    // Renomme les compétences si le nom change
    if (trimmed !== oldName) {
      const { error: skillsError } = await supabase
        .from("skills")
        .update({ category: trimmed })
        .eq("category", oldName);
      if (skillsError) {
        toast({
          title: "Erreur",
          description: "Impossible de renommer les compétences liées",
          variant: "destructive",
        });
        return false;
      }
    }

    const exists = categoriesMeta.some((c) => c.name === oldName);
    const next = exists
      ? categoriesMeta.map((c) =>
          c.name === oldName ? { name: trimmed, icon: icon?.trim() || null } : c
        )
      : [...categoriesMeta, { name: trimmed, icon: icon?.trim() || null }];

    const ok = await persist(next);
    if (ok) toast({ title: "Catégorie modifiée" });
    return ok;
  };

  const deleteCategory = async (name: string): Promise<boolean> => {
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

    const next = categoriesMeta.filter((c) => c.name !== name);
    if (next.length !== categoriesMeta.length) {
      const ok = await persist(next);
      if (!ok) return false;
    }

    toast({ title: "Catégorie supprimée" });
    return true;
  };

  const categories = categoriesMeta.map((c) => c.name);

  return {
    categories,
    categoriesMeta,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};
