import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProjectFormData } from "./types";
import ImagesManager from "./ImagesManager";

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
        <Label htmlFor="img">URL de l'image</Label>
        <Input
          id="img"
          type="url"
          value={formData.img}
          onChange={(e) => onFieldChange("img", e.target.value)}
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
    </>
  );
};

export default ProjectFormFields;
