import { useState, useEffect } from "react";
import { useContentSettings, ContentSettings } from "@/hooks/useContentSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentManager = () => {
  const { content, loading, updateContent } = useContentSettings();
  const [formData, setFormData] = useState<ContentSettings | null>(null);
  const [saving, setSaving] = useState(false);
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

  const handleAboutTitleChange = (value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      about: { ...formData.about, title: value },
    });
  };

  const handleParagraphChange = (index: number, value: string) => {
    if (!formData) return;
    const newParagraphs = [...formData.about.paragraphs];
    newParagraphs[index] = value;
    setFormData({
      ...formData,
      about: { ...formData.about, paragraphs: newParagraphs },
    });
  };

  const addParagraph = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      about: { ...formData.about, paragraphs: [...formData.about.paragraphs, ""] },
    });
  };

  const removeParagraph = (index: number) => {
    if (!formData || formData.about.paragraphs.length <= 1) return;
    const newParagraphs = formData.about.paragraphs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      about: { ...formData.about, paragraphs: newParagraphs },
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
            <Textarea
              id="hero-subtitle"
              value={formData.hero.subtitle}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
              placeholder="Designer & Développeur passionné..."
              rows={2}
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Paragraphes</Label>
              <Button type="button" variant="outline" size="sm" onClick={addParagraph}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {formData.about.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  placeholder={`Paragraphe ${index + 1}`}
                  rows={3}
                  className="flex-1"
                />
                {formData.about.paragraphs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParagraph(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
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
