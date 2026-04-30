import { useEffect, useState } from "react";
import { useDisplayMode, DisplayMode } from "@/hooks/useDisplayMode";
import { useProjectOrder, ProjectOrder } from "@/hooks/useProjectOrder";
import { useSocialLinks, SocialLink } from "@/hooks/useSocialLinks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LayoutGrid, GalleryHorizontal, Code2, Palette, Plus, Trash2 } from "lucide-react";
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
import DynamicIcon from "@/components/DynamicIcon";

const SettingsManager = () => {
  const { displayMode, loading, updateDisplayMode } = useDisplayMode();
  const { projectOrder, loading: orderLoading, updateProjectOrder } = useProjectOrder();
  const { links, loading: linksLoading, updateLinks } = useSocialLinks();
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [linkForm, setLinkForm] = useState<SocialLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setLinkForm(links);
  }, [links]);

  const handleToggle = async () => {
    setSaving(true);
    const newMode: DisplayMode = displayMode === "gallery" ? "grid" : "gallery";
    const success = await updateDisplayMode(newMode);
    toast({
      title: success ? "Paramètres mis à jour" : "Erreur",
      description: success
        ? `Mode d'affichage changé en ${newMode === "grid" ? "grille" : "galerie horizontale"}.`
        : "Impossible de mettre à jour les paramètres.",
      variant: success ? "default" : "destructive",
    });
    setSaving(false);
  };

  const handleOrderToggle = async () => {
    setSavingOrder(true);
    const newOrder: ProjectOrder = projectOrder === "design-first" ? "dev-first" : "design-first";
    const success = await updateProjectOrder(newOrder);
    toast({
      title: success ? "Ordre mis à jour" : "Erreur",
      description: success
        ? newOrder === "dev-first"
          ? "Les projets Dev s'affichent désormais avant les projets Design."
          : "Les projets Design s'affichent désormais avant les projets Dev."
        : "Impossible de mettre à jour l'ordre des projets.",
      variant: success ? "default" : "destructive",
    });
    setSavingOrder(false);
  };

  const handleAddLink = () => {
    setLinkForm([
      ...linkForm,
      { id: crypto.randomUUID(), label: "", url: "", icon: "" },
    ]);
  };

  const handleUpdateLink = (id: string, field: keyof SocialLink, value: string) => {
    setLinkForm(linkForm.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleDeleteLink = (id: string) => {
    setLinkForm(linkForm.filter((l) => l.id !== id));
  };

  const handleSaveLinks = async () => {
    setSavingLinks(true);
    const success = await updateLinks(linkForm);
    toast({
      title: success ? "Liens mis à jour" : "Erreur",
      description: success
        ? "Les liens du footer ont été enregistrés."
        : "Impossible de mettre à jour les liens.",
      variant: success ? "default" : "destructive",
    });
    setSavingLinks(false);
  };

  if (loading || orderLoading || linksLoading) {
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
            {displayMode === "grid" ? <LayoutGrid className="h-5 w-5" /> : <GalleryHorizontal className="h-5 w-5" />}
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
          <Switch id="display-mode" checked={displayMode === "grid"} onCheckedChange={handleToggle} disabled={saving} />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-md bg-muted">
            {projectOrder === "dev-first" ? <Code2 className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
          </div>
          <div>
            <Label htmlFor="project-order" className="text-base font-medium">
              Projets Dev avant Design
            </Label>
            <p className="text-sm text-muted-foreground">
              {projectOrder === "dev-first"
                ? "Les projets Dev s'affichent avant les projets Web Design"
                : "Les projets Web Design s'affichent avant les projets Dev"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savingOrder && <Loader2 className="h-4 w-4 animate-spin" />}
          <Switch
            id="project-order"
            checked={projectOrder === "dev-first"}
            onCheckedChange={handleOrderToggle}
            disabled={savingOrder}
          />
        </div>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium">Liens du footer</h4>
            <p className="text-sm text-muted-foreground">
              Ajoutez, modifiez ou supprimez les liens affichés dans le footer. Utilisez le nom d'une icône Lucide (ex: Linkedin, Github, Mail, Twitter, Instagram).
            </p>
          </div>
          <Button onClick={handleAddLink} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        {linkForm.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Aucun lien. Cliquez sur "Ajouter" pour en créer un.</p>
        ) : (
          <div className="space-y-3">
            {linkForm.map((link) => (
              <div key={link.id} className="flex items-end gap-2 p-3 border rounded-md">
                <div className="p-2 rounded-md bg-muted shrink-0 mb-[2px]">
                  <DynamicIcon name={link.icon} className="h-5 w-5" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nom</Label>
                    <Input
                      placeholder="LinkedIn"
                      value={link.label}
                      onChange={(e) => handleUpdateLink(link.id, "label", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input
                      placeholder="https://... ou mailto:..."
                      value={link.url}
                      onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Icône (Lucide)</Label>
                    <Input
                      placeholder="Ex: Linkedin, Github, Mail"
                      value={link.icon}
                      onChange={(e) => handleUpdateLink(link.id, "icon", e.target.value)}
                    />
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive shrink-0 mb-[2px]">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce lien ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Le lien "{link.label || "(sans nom)"}" sera retiré de la liste. N'oubliez pas d'enregistrer pour rendre la suppression définitive.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteLink(link.id)}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Voir{" "}
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="underline">
            lucide.dev/icons
          </a>{" "}
          pour la liste des icônes disponibles.
        </p>

        <Button onClick={handleSaveLinks} disabled={savingLinks}>
          {savingLinks && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Enregistrer les liens
        </Button>
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
