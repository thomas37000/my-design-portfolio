import { useState } from "react";
import { useDisplayMode, DisplayMode } from "@/hooks/useDisplayMode";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LayoutGrid, GalleryHorizontal } from "lucide-react";

const SettingsManager = () => {
  const { displayMode, loading, updateDisplayMode } = useDisplayMode();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setSaving(true);
    const newMode: DisplayMode = displayMode === "gallery" ? "grid" : "gallery";
    const success = await updateDisplayMode(newMode);
    
    if (success) {
      toast({
        title: "Paramètres mis à jour",
        description: `Mode d'affichage changé en ${newMode === "grid" ? "grille" : "galerie horizontale"}.`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-md bg-muted">
            {displayMode === "grid" ? (
              <LayoutGrid className="h-5 w-5" />
            ) : (
              <GalleryHorizontal className="h-5 w-5" />
            )}
          </div>
          <div>
            <Label htmlFor="display-mode" className="text-base font-medium">
              Affichage des projets en grille
            </Label>
            <p className="text-sm text-muted-foreground">
              {displayMode === "grid" 
                ? "Les projets s'affichent en grille sur les écrans larges" 
                : "Les projets s'affichent en galerie horizontale avec défilement"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <Switch
            id="display-mode"
            checked={displayMode === "grid"}
            onCheckedChange={handleToggle}
            disabled={saving}
          />
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-muted/50">
        <h4 className="font-medium mb-2">Aperçu du mode actuel</h4>
        <div className="flex gap-4 items-center">
          <div className={`p-3 rounded border-2 ${displayMode === "gallery" ? "border-primary bg-primary/10" : "border-muted-foreground/20"}`}>
            <GalleryHorizontal className="h-8 w-8" />
            <p className="text-xs mt-1 text-center">Galerie</p>
          </div>
          <div className={`p-3 rounded border-2 ${displayMode === "grid" ? "border-primary bg-primary/10" : "border-muted-foreground/20"}`}>
            <LayoutGrid className="h-8 w-8" />
            <p className="text-xs mt-1 text-center">Grille</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
