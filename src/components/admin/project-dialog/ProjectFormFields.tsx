import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Image, Upload, Loader2 } from "lucide-react";
import { ProjectFormData } from "./types";
import ImagesManager from "./ImagesManager";
import StoragePicker from "./StoragePicker";
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
  const [imgUploading, setImgUploading] = useState(false);

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
        <Input id="titre" value={formData.titre} onChange={(e) => onFieldChange("titre", e.target.value)} maxLength={200} required />
      </div>

      <div>
        <Label htmlFor="nom_projet">Nom du projet</Label>
        <Input id="nom_projet" value={formData.nom_projet} onChange={(e) => onFieldChange("nom_projet", e.target.value)} maxLength={200} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => onFieldChange("description", e.target.value)} maxLength={1000} rows={4} />
      </div>

      <div>
        <Label htmlFor="organisme">Organisme</Label>
        <Input id="organisme" value={formData.organisme} onChange={(e) => onFieldChange("organisme", e.target.value)} maxLength={200} />
      </div>

      <div>
        <Label htmlFor="lien_url">URL du projet</Label>
        <Input id="lien_url" type="url" value={formData.lien_url} onChange={(e) => onFieldChange("lien_url", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="img">Image principale</Label>
        <div className="flex gap-2">
          <Input id="img" type="url" value={formData.img} onChange={(e) => onFieldChange("img", e.target.value)} placeholder="URL de l'image" className="flex-1" />
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
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input id="github" type="url" value={formData.github} onChange={(e) => onFieldChange("github", e.target.value)} />
        </div>
      )}

      {projectType === "design" && (
        <>
          <ImagesManager images={formData.images} onChange={(images) => onFieldChange("images", images)} />
          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input id="tags" value={formData.tags} onChange={(e) => onFieldChange("tags", e.target.value)} placeholder="UI/UX, Web Design, Branding" />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Switch id="fini" checked={formData.fini} onCheckedChange={(checked) => onFieldChange("fini", checked)} />
        <Label htmlFor="fini">Projet terminé</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="IA" checked={formData.IA} onCheckedChange={(checked) => onFieldChange("IA", checked)} />
        <Label htmlFor="IA">Utilise l'IA</Label>
      </div>

      <StoragePicker
        open={imgPickerOpen}
        onOpenChange={setImgPickerOpen}
        title="Choisir une image principale"
        onPick={(url) => onFieldChange("img", url)}
      />
    </>
  );
};

export default ProjectFormFields;
