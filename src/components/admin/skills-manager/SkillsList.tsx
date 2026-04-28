import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skill, groupSkillsByCategory } from "./types";
import EditCategoryDialog from "./EditCategoryDialog";
import { CategoryMeta } from "./useCustomCategories";

interface SkillsListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
  onDeleteCategory?: (category: string) => void;
  onUpdateCategory?: (oldName: string, newName: string, icon: string | null) => Promise<boolean>;
  categoriesMeta?: CategoryMeta[];
}

const SkillsList = ({
  skills,
  onEdit,
  onDelete,
  onDeleteCategory,
  onUpdateCategory,
  categoriesMeta = [],
}: SkillsListProps) => {
  const groupedSkills = groupSkillsByCategory(skills);

  if (Object.keys(groupedSkills).length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Aucune compétence ajoutée
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => {
        const meta = categoriesMeta.find((c) => c.name === category);
        return (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{category}</h3>
            {onUpdateCategory && (
              <EditCategoryDialog
                categoryName={category}
                currentIcon={meta?.icon}
                onSave={(newName, icon) => onUpdateCategory(category, newName, icon)}
              />
            )}
            {onDeleteCategory && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Supprimer la catégorie « {category} » ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Toutes les compétences
                      reliées à cette catégorie ({categorySkills.length}{" "}
                      {categorySkills.length > 1 ? "compétences" : "compétence"})
                      seront également supprimées.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteCategory(category)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-1 bg-secondary/50 rounded-full pl-3 pr-1 py-1"
              >
                <span className="text-sm">{skill.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEdit(skill)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => onDelete(skill.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
