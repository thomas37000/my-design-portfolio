import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProjectForm } from "./project-dialog/useProjectForm";
import ProjectFormFields from "./project-dialog/ProjectFormFields";
import SkillsSelector from "./project-dialog/SkillsSelector";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any | null;
  projectType: "dev" | "design";
  onSave: () => void;
}

const ProjectDialog = ({
  open,
  onOpenChange,
  project,
  projectType,
  onSave,
}: ProjectDialogProps) => {
  const {
    formData,
    updateField,
    saving,
    skills,
    selectedSkillIds,
    toggleSkill,
    handleSave,
  } = useProjectForm({
    project,
    projectType,
    open,
    onSave,
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Modifier le projet" : "Nouveau projet"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ProjectFormFields
            formData={formData}
            projectType={projectType}
            onFieldChange={updateField}
          />
          <SkillsSelector
            skills={skills}
            selectedSkillIds={selectedSkillIds}
            onToggleSkill={toggleSkill}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
