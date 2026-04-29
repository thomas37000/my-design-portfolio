import { useEffect, useState } from "react";
import { useDisplayMode, DisplayMode } from "@/hooks/useDisplayMode";
import { useProjectOrder, ProjectOrder } from "@/hooks/useProjectOrder";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LayoutGrid, GalleryHorizontal, Code2, Palette, Linkedin, Github, Mail } from "lucide-react";

const SettingsManager = () => {
  const { displayMode, loading, updateDisplayMode } = useDisplayMode();
  const { projectOrder, loading: orderLoading, updateProjectOrder } = useProjectOrder();
  const { links, loading: linksLoading, updateLinks } = useSocialLinks();
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [linkForm, setLinkForm] = useState({ linkedin: "", github: "", email: "" });
  const { toast } = useToast();

  useEffect(() => {
    setLinkForm(links);
  }, [links]);


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

  const handleOrderToggle = async () => {
    setSavingOrder(true);
    const newOrder: ProjectOrder = projectOrder === "design-first" ? "dev-first" : "design-first";
    const success = await updateProjectOrder(newOrder);

    if (success) {
      toast({
        title: "Ordre mis à jour",
        description: newOrder === "dev-first"
          ? "Les projets Dev s'affichent désormais avant les projets Design."
          : "Les projets Design s'affichent désormais avant les projets Dev.",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre des projets.",
        variant: "destructive",
      });
    }
    setSavingOrder(false);
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

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-md bg-muted">
            {projectOrder === "dev-first" ? (
              <Code2 className="h-5 w-5" />
            ) : (
              <Palette className="h-5 w-5" />
            )}
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
        <div>
          <h4 className="font-medium">Liens du footer</h4>
          <p className="text-sm text-muted-foreground">
            Configurez les liens LinkedIn, GitHub et Email affichés dans le footer.
          </p>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Label>
            <Input
              id="linkedin-url"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              value={linkForm.linkedin}
              onChange={(e) => setLinkForm({ ...linkForm, linkedin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-url" className="flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </Label>
            <Input
              id="github-url"
              type="url"
              placeholder="https://github.com/..."
              value={linkForm.github}
              onChange={(e) => setLinkForm({ ...linkForm, github: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-link" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </Label>
            <Input
              id="email-link"
              type="email"
              placeholder="contact@example.com"
              value={linkForm.email}
              onChange={(e) => setLinkForm({ ...linkForm, email: e.target.value })}
            />
          </div>
        </div>
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
