import { useSkillsManager } from "./skills-manager/useSkillsManager";
import SkillDialog from "./skills-manager/SkillDialog";
import SkillsList from "./skills-manager/SkillsList";

const SkillsManager = () => {
  const {
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
  } = useSkillsManager();

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SkillDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          isEditing={!!editingSkill}
          formData={formData}
          onFieldChange={updateFormField}
          onSave={handleSave}
          onAddClick={openAddDialog}
          saving={saving}
        />
      </div>

      <SkillsList
        skills={skills}
        onEdit={openEditDialog}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SkillsManager;
