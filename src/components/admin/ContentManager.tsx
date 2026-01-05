import { useState, useEffect, useRef } from "react";
import { useContentSettings, ContentSettings } from "@/hooks/useContentSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";

const ContentManager = () => {
  const { content, loading, updateContent } = useContentSettings();
  const [formData, setFormData] = useState<ContentSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (content && !formData) {
      setFormData(content);
    }
  }, [content, formData]);

  const handleHeroChange = (field: keyof ContentSettings["hero"], value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      hero: { ...formData.hero, [field]: value },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-image-${Date.now()}.${fileExt}`;

      // Delete old image if exists
      if (formData.hero.image) {
        const oldPath = formData.hero.image.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("cv-files").remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("cv-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("cv-files")
        .getPublicUrl(fileName);

      setFormData({
        ...formData,
        hero: { ...formData.hero, image: publicUrl },
      });

      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = async () => {
    if (!formData?.hero.image) return;

    try {
      const oldPath = formData.hero.image.split("/").pop();
      if (oldPath) {
        await supabase.storage.from("cv-files").remove([oldPath]);
      }

      setFormData({
        ...formData,
        hero: { ...formData.hero, image: undefined },
      });

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée.",
      });
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleAboutTitleChange = (value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      about: { ...formData.about, title: value },
    });
  };

  const handleRichContentChange = (value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      about: { ...formData.about, richContent: value },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    const success = await updateContent(formData);

    if (success) {
      toast({
        title: "Contenu mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Titre principal</Label>
            <Input
              id="hero-title"
              value={formData.hero.title}
              onChange={(e) => handleHeroChange("title", e.target.value)}
              placeholder="Créateur Digital"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Sous-titre</Label>
            <Input
              id="hero-subtitle"
              value={formData.hero.subtitle}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
              placeholder="Designer & Développeur passionné..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-btn-projects">Bouton Projets</Label>
              <Input
                id="hero-btn-projects"
                value={formData.hero.buttonProjects}
                onChange={(e) => handleHeroChange("buttonProjects", e.target.value)}
                placeholder="Voir mes projets"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-btn-contact">Bouton Contact</Label>
              <Input
                id="hero-btn-contact"
                value={formData.hero.buttonContact}
                onChange={(e) => handleHeroChange("buttonContact", e.target.value)}
                placeholder="Me contacter"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image Hero (optionnelle)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {formData.hero.image ? (
              <div className="relative inline-block">
                <img
                  src={formData.hero.image}
                  alt="Hero preview"
                  className="w-48 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Ajouter une image
                  </>
                )}
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Si une image est ajoutée, le Hero aura un design différent avec l'image en arrière-plan.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section À propos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about-title">Titre</Label>
            <Input
              id="about-title"
              value={formData.about.title}
              onChange={(e) => handleAboutTitleChange(e.target.value)}
              placeholder="À propos de moi"
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu</Label>
            <RichTextEditor
              content={formData.about.richContent || ""}
              onChange={handleRichContentChange}
            />
            <p className="text-xs text-muted-foreground">
              Utilisez la barre d'outils pour mettre en forme le texte (gras, italique, listes...)
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          "Enregistrer les modifications"
        )}
      </Button>
    </form>
  );
};

export default ContentManager;
