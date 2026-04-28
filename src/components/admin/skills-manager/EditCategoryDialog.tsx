import { useEffect, useState } from "react";
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
import { Pencil } from "lucide-react";

interface EditCategoryDialogProps {
  categoryName: string;
  currentIcon?: string | null;
  onSave: (newName: string, icon: string | null) => Promise<boolean>;
}

const EditCategoryDialog = ({ categoryName, currentIcon, onSave }: EditCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(categoryName);
  const [icon, setIcon] = useState(currentIcon || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(categoryName);
      setIcon(currentIcon || "");
    }
  }, [open, categoryName, currentIcon]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(name, icon || null);
    setSaving(false);
    if (ok) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title="Modifier la catégorie"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-cat-name">Nom *</Label>
            <Input
              id="edit-cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-cat-icon">Icône (nom Lucide, optionnel)</Label>
            <Input
              id="edit-cat-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ex: Code, Palette, Database..."
            />
            <p className="text-xs text-muted-foreground">
              Voir{" "}
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                lucide.dev/icons
              </a>{" "}
              pour la liste des icônes disponibles.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
