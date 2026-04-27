import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { SkillFormData, SKILL_CATEGORIES, Skill } from "./types";

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formData: SkillFormData;
  onFieldChange: <K extends keyof SkillFormData>(field: K, value: SkillFormData[K]) => void;
  onSave: () => void;
  onAddClick: () => void;
  saving: boolean;
  skills: Skill[];
}

const NEW_CATEGORY_VALUE = "__new__";

const SkillDialog = ({
  open,
  onOpenChange,
  isEditing,
  formData,
  onFieldChange,
  onSave,
  onAddClick,
  saving,
  skills,
}: SkillDialogProps) => {
  const [creatingNew, setCreatingNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const allCategories = useMemo(() => {
    const fromSkills = skills.map((s) => s.category).filter(Boolean);
    return Array.from(new Set([...SKILL_CATEGORIES, ...fromSkills])).sort();
  }, [skills]);

  useEffect(() => {
    if (!open) {
      setCreatingNew(false);
      setNewCategory("");
    }
  }, [open]);

  const handleCategoryChange = (value: string) => {
    if (value === NEW_CATEGORY_VALUE) {
      setCreatingNew(true);
      setNewCategory("");
      onFieldChange("category", "");
    } else {
      setCreatingNew(false);
      onFieldChange("category", value);
    }
  };

  const handleNewCategoryChange = (value: string) => {
    setNewCategory(value);
    onFieldChange("category", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une compétence
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la compétence" : "Ajouter une compétence"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Ex: React, Figma..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            {creatingNew ? (
              <div className="space-y-2">
                <Input
                  id="category"
                  value={newCategory}
                  onChange={(e) => handleNewCategoryChange(e.target.value)}
                  placeholder="Nom de la nouvelle catégorie"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCreatingNew(false);
                    setNewCategory("");
                    onFieldChange("category", "");
                  }}
                >
                  Choisir une catégorie existante
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCreatingNew(true);
                    setNewCategory("");
                    onFieldChange("category", "");
                  }}
                  title="Créer une nouvelle catégorie"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icône (optionnel)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => onFieldChange("icon", e.target.value)}
              placeholder="Nom de l'icône Lucide"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDialog;
