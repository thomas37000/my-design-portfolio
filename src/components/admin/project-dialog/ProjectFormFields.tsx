import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image, Upload, Loader2 } from "lucide-react";
import { ProjectFormData } from "./types";
import ImagesManager from "./ImagesManager";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "project-images";

interface ProjectFormFieldsProps {
  formData: ProjectFormData;
  projectType: "dev" | "design";
  onFieldChange: <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => void;
}

const ProjectFormFields = ({
  formData,
  projectType,
  onFieldChange,
}: ProjectFormFieldsProps) => {
  const [imgPickerOpen, setImgPickerOpen] = useState(false);
  const [storageImages, setStorageImages] = useState<{ name: string; publicUrl: string }[]>([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const fetchStorageImages = useCallback(async () => {
    setStorageLoading(true);
    try {
      const allImages: { name: string; publicUrl: string }[] = [];
      const listFolder = async (folder: string) => {
        const { data } = await supabase.storage
          .from(BUCKET)
          .list(folder, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
        if (!data) return;
        for (const item of data) {
          const path = folder ? `${folder}/${item.name}` : item.name;
          if (item.id === null) {
            await listFolder(path);
          } else if (item.name !== ".keep") {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
            allImages.push({ name: path, publicUrl: urlData.publicUrl });
          }
        }
      };
      await listFolder("");
      setStorageImages(allImages);
    } catch { /* ignore */ } finally {
      setStorageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (imgPickerOpen) fetchStorageImages();
  }, [imgPickerOpen, fetchStorageImages]);

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { cacheControl: "3600" });
    if (!error) {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      onFieldChange("img", urlData.publicUrl);
    }
    setImgUploading(false);
    e.target.value = "";
  };

  return (
    <>
      <div>
        <Label htmlFor="titre">Titre *</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e) => onFieldChange("titre", e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div>
        <Label htmlFor="nom_projet">Nom du projet</Label>
        <Input
          id="nom_projet"
          value={formData.nom_projet}
          onChange={(e) => onFieldChange("nom_projet", e.target.value)}
          maxLength={200}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          maxLength={1000}
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="organisme">Organisme</Label>
        <Input
          id="organisme"
          value={formData.organisme}
          onChange={(e) => onFieldChange("organisme", e.target.value)}
          maxLength={200}
        />
      </div>

      <div>
        <Label htmlFor="lien_url">URL du projet</Label>
        <Input
          id="lien_url"
          type="url"
          value={formData.lien_url}
          onChange={(e) => onFieldChange("lien_url", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="img">Image principale</Label>
        <div className="flex gap-2">
          <Input
            id="img"
            type="url"
            value={formData.img}
            onChange={(e) => onFieldChange("img", e.target.value)}
            placeholder="URL de l'image"
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon" onClick={() => setImgPickerOpen(true)} title="Bibliothèque">
            <Image className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Label
              htmlFor="img-upload"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {imgUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Label>
            <input id="img-upload" type="file" accept="image/*" className="sr-only" onChange={handleImgUpload} disabled={imgUploading} />
          </div>
        </div>
        {formData.img && (
          <div className="mt-2 h-20 w-32 rounded overflow-hidden border border-border">
            <img src={formData.img} alt="Aperçu" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
          </div>
        )}
      </div>

      {projectType === "dev" && (
        <>
          <div>
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              type="url"
              value={formData.github}
              onChange={(e) => onFieldChange("github", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="technos">Technologies (séparées par des virgules)</Label>
            <Input
              id="technos"
              value={formData.technos}
              onChange={(e) => onFieldChange("technos", e.target.value)}
              placeholder="React, TypeScript, Node.js"
            />
          </div>
        </>
      )}

      {projectType === "design" && (
        <>
          <ImagesManager
            images={formData.images}
            onChange={(images) => onFieldChange("images", images)}
          />
          <div>
            <Label htmlFor="logiciels">Logiciels (séparés par des virgules)</Label>
            <Input
              id="logiciels"
              value={formData.logiciels}
              onChange={(e) => onFieldChange("logiciels", e.target.value)}
              placeholder="Figma, Photoshop, Illustrator"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => onFieldChange("tags", e.target.value)}
              placeholder="UI/UX, Web Design, Branding"
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="fini"
          checked={formData.fini}
          onCheckedChange={(checked) => onFieldChange("fini", checked)}
        />
        <Label htmlFor="fini">Projet terminé</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="IA"
          checked={formData.IA}
          onCheckedChange={(checked) => onFieldChange("IA", checked)}
        />
        <Label htmlFor="IA">Utilise l'IA</Label>
      </div>

      {/* Image picker dialog for main image */}
      <Dialog open={imgPickerOpen} onOpenChange={setImgPickerOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisir une image principale</DialogTitle>
          </DialogHeader>
          {storageLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : storageImages.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              Aucune image disponible. Uploadez des images via l'onglet "Images".
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {storageImages.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => {
                    onFieldChange("img", img.publicUrl);
                    setImgPickerOpen(false);
                  }}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors focus:outline-none focus:border-primary"
                >
                  <img
                    src={img.publicUrl}
                    alt={img.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectFormFields;
