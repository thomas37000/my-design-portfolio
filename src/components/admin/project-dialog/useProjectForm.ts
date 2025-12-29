import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Skill,
  ProjectFormData,
  initialFormData,
  projectSchema,
  parseArrayField,
} from "./types";

interface UseProjectFormProps {
  project: any | null;
  projectType: "dev" | "design";
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

export const useProjectForm = ({
  project,
  projectType,
  open,
  onSave,
  onClose,
}: UseProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const { toast } = useToast();

  const tableName = projectType === "dev" ? "dev_projects" : "designer_projects";
  const junctionTable = projectType === "dev" ? "dev_project_skills" : "designer_project_skills";

  // Fetch all skills
  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase
        .from("skills")
        .select("id, name, category")
        .order("category")
        .order("name");
      if (data) setSkills(data);
    };
    fetchSkills();
  }, []);

  // Fetch project skills when editing
  useEffect(() => {
    const fetchProjectSkills = async () => {
      if (!project || !open) {
        setSelectedSkillIds([]);
        return;
      }
      const { data } = await supabase
        .from(junctionTable)
        .select("skill_id")
        .eq("project_id", project.id);
      if (data) setSelectedSkillIds(data.map((d) => d.skill_id));
    };
    fetchProjectSkills();
  }, [project, open, junctionTable]);

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        titre: project.titre || "",
        nom_projet: project.nom_projet || "",
        description: project.description || "",
        organisme: project.organisme || "",
        lien_url: project.lien_url || "",
        img: project.img || "",
        github: project.github || "",
        technos: project.technos?.join(", ") || "",
        logiciels: project.logiciels?.join(", ") || "",
        tags: project.tags?.join(", ") || "",
        fini: project.fini || false,
        IA: project.IA || false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [project]);

  const updateField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      projectSchema.parse({
        titre: formData.titre,
        nom_projet: formData.nom_projet,
        description: formData.description,
        organisme: formData.organisme,
        lien_url: formData.lien_url || undefined,
        img: formData.img || undefined,
      });

      const dataToSave: any = {
        titre: formData.titre.trim(),
        nom_projet: formData.nom_projet.trim() || null,
        description: formData.description.trim() || null,
        organisme: formData.organisme.trim() || null,
        lien_url: formData.lien_url.trim() || null,
        img: formData.img.trim() || null,
        fini: formData.fini,
        IA: formData.IA,
      };

      if (projectType === "dev") {
        dataToSave.github = formData.github.trim() || null;
        dataToSave.technos = parseArrayField(formData.technos);
      } else {
        dataToSave.logiciels = parseArrayField(formData.logiciels);
        dataToSave.tags = parseArrayField(formData.tags);
      }

      let projectId = project?.id;

      if (project) {
        const { error } = await supabase
          .from(tableName)
          .update(dataToSave)
          .eq("id", project.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from(tableName)
          .insert([dataToSave])
          .select("id")
          .single();
        if (error) throw error;
        projectId = data.id;
      }

      // Update skills
      await supabase.from(junctionTable).delete().eq("project_id", projectId);
      if (selectedSkillIds.length > 0) {
        const skillInserts = selectedSkillIds.map((skill_id) => ({
          project_id: projectId,
          skill_id,
        }));
        const { error: skillError } = await supabase
          .from(junctionTable)
          .insert(skillInserts);
        if (skillError) throw skillError;
      }

      toast({
        title: "Succès",
        description: project ? "Projet mis à jour" : "Projet créé",
      });
      onSave();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder le projet",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    updateField,
    saving,
    skills,
    selectedSkillIds,
    toggleSkill,
    handleSave,
  };
};
