import { useSkillsManager } from "./skills-manager/useSkillsManager";
import { useCustomCategories } from "./skills-manager/useCustomCategories";
import SkillDialog from "./skills-manager/SkillDialog";
import SkillsList from "./skills-manager/SkillsList";
import CategoryDialog from "./skills-manager/CategoryDialog";

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

  const { categories: customCategories, addCategory } = useCustomCategories();

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end gap-2">
        <SkillDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          isEditing={!!editingSkill}
          formData={formData}
          onFieldChange={updateFormField}
          onSave={handleSave}
          onAddClick={openAddDialog}
          saving={saving}
          skills={skills}
          extraCategories={customCategories}
        />
        <CategoryDialog onAdd={addCategory} />
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
