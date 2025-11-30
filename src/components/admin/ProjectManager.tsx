import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectList from "./ProjectList";
import ProjectDialog from "./ProjectDialog";

interface ProjectManagerProps {
  projectType: "dev" | "design";
}

const ProjectManager = ({ projectType }: ProjectManagerProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const { toast } = useToast();

  const tableName = projectType === "dev" ? "dev_projects" : "designer_projects";

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [projectType]);

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Projet supprimé",
      });
      fetchProjects();
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleSave = () => {
    handleDialogClose();
    fetchProjects();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un projet
        </Button>
      </div>

      <ProjectList
        projects={projects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        projectType={projectType}
      />

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        project={editingProject}
        projectType={projectType}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProjectManager;
