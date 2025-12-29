import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skill, SkillFormData, initialSkillFormData } from "./types";

export const useSkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(initialSkillFormData);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSkills = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les compétences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const openAddDialog = () => {
    setEditingSkill(null);
    setFormData(initialSkillFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
    });
    setDialogOpen(true);
  };

  const updateFormField = <K extends keyof SkillFormData>(
    field: K,
    value: SkillFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        name: formData.name,
        category: formData.category,
        icon: formData.icon || null,
      };

      if (editingSkill) {
        const { error } = await supabase
          .from("skills")
          .update(dataToSave)
          .eq("id", editingSkill.id);
        if (error) throw error;
        toast({ title: "Compétence modifiée" });
      } else {
        const { error } = await supabase.from("skills").insert(dataToSave);
        if (error) throw error;
        toast({ title: "Compétence ajoutée" });
      }

      setDialogOpen(false);
      fetchSkills();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la compétence",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Compétence supprimée" });
      fetchSkills();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    }
  };

  return {
    skills,
    loading,
    dialogOpen,
    setDialogOpen,
    editingSkill,
    formData,
    updateFormField,
    saving,
    openAddDialog,
    openEditDialog,
    handleSave,
    handleDelete,
  };
};
