import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any | null;
  projectType: "dev" | "design";
  onSave: () => void;
}

const projectSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis").max(200),
  nom_projet: z.string().trim().max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  organisme: z.string().trim().max(200).optional(),
  lien_url: z.string().trim().url("URL invalide").or(z.literal("")).optional(),
  img: z.string().trim().url("URL invalide").or(z.literal("")).optional(),
});

const ProjectDialog = ({ open, onOpenChange, project, projectType, onSave }: ProjectDialogProps) => {
  const [formData, setFormData] = useState({
    titre: "",
    nom_projet: "",
    description: "",
    organisme: "",
    lien_url: "",
    img: "",
    github: "",
    technos: "",
    logiciels: "",
    tags: "",
    fini: false,
    IA: false,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        titre: project.titre || "",
        nom_projet: project.nom_projet || "",
        description: project.description || "",
        organisme: project.organisme || "",
        lien_url: project.lien_url || "",
        img: project.img || "",
        github: project.github || "",
        technos: project.technos?.join(", ") || "",
        logiciels: project.logiciels?.join(", ") || "",
        tags: project.tags?.join(", ") || "",
        fini: project.fini || false,
        IA: project.IA || false,
      });
    } else {
      setFormData({
        titre: "",
        nom_projet: "",
        description: "",
        organisme: "",
        lien_url: "",
        img: "",
        github: "",
        technos: "",
        logiciels: "",
        tags: "",
        fini: false,
        IA: false,
      });
    }
  }, [project]);

  const handleSave = async () => {
    setSaving(true);
    const tableName = projectType === "dev" ? "dev_projects" : "designer_projects";

    try {
      // Validate basic fields
      projectSchema.parse({
        titre: formData.titre,
        nom_projet: formData.nom_projet,
        description: formData.description,
        organisme: formData.organisme,
        lien_url: formData.lien_url || undefined,
        img: formData.img || undefined,
      });

      const dataToSave: any = {
        titre: formData.titre.trim(),
        nom_projet: formData.nom_projet.trim() || null,
        description: formData.description.trim() || null,
        organisme: formData.organisme.trim() || null,
        lien_url: formData.lien_url.trim() || null,
        img: formData.img.trim() || null,
        fini: formData.fini,
        IA: formData.IA,
      };

      if (projectType === "dev") {
        dataToSave.github = formData.github.trim() || null;
        dataToSave.technos = formData.technos
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else {
        dataToSave.logiciels = formData.logiciels
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l);
        dataToSave.tags = formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      }

      let error;
      if (project) {
        ({ error } = await supabase.from(tableName).update(dataToSave).eq("id", project.id));
      } else {
        ({ error } = await supabase.from(tableName).insert([dataToSave]));
      }

      if (error) throw error;

      toast({
        title: "Succès",
        description: project ? "Projet mis à jour" : "Projet créé",
      });
      onSave();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder le projet",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Modifier le projet" : "Nouveau projet"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              maxLength={200}
              required
            />
          </div>

          <div>
            <Label htmlFor="nom_projet">Nom du projet</Label>
            <Input
              id="nom_projet"
              value={formData.nom_projet}
              onChange={(e) => setFormData({ ...formData, nom_projet: e.target.value })}
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="organisme">Organisme</Label>
            <Input
              id="organisme"
              value={formData.organisme}
              onChange={(e) => setFormData({ ...formData, organisme: e.target.value })}
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="lien_url">URL du projet</Label>
            <Input
              id="lien_url"
              type="url"
              value={formData.lien_url}
              onChange={(e) => setFormData({ ...formData, lien_url: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="img">URL de l'image</Label>
            <Input
              id="img"
              type="url"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
            />
          </div>

          {projectType === "dev" && (
            <>
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="technos">Technologies (séparées par des virgules)</Label>
                <Input
                  id="technos"
                  value={formData.technos}
                  onChange={(e) => setFormData({ ...formData, technos: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </>
          )}

          {projectType === "design" && (
            <>
              <div>
                <Label htmlFor="logiciels">Logiciels (séparés par des virgules)</Label>
                <Input
                  id="logiciels"
                  value={formData.logiciels}
                  onChange={(e) => setFormData({ ...formData, logiciels: e.target.value })}
                  placeholder="Figma, Photoshop, Illustrator"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="UI/UX, Web Design, Branding"
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="fini"
              checked={formData.fini}
              onCheckedChange={(checked) => setFormData({ ...formData, fini: checked })}
            />
            <Label htmlFor="fini">Projet terminé</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="IA"
              checked={formData.IA}
              onCheckedChange={(checked) => setFormData({ ...formData, IA: checked })}
            />
            <Label htmlFor="IA">Utilise l'IA</Label>
          </div>
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
