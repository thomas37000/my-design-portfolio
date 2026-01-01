import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const educationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const languageSchema = z.object({
  name: z.string(),
  level: z.string(),
});

const cvSchema = z.object({
  full_name: z.string().min(1, "Nom requis"),
  title: z.string().min(1, "Titre requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
});

type CVFormData = z.infer<typeof cvSchema>;
type Experience = z.infer<typeof experienceSchema>;
type Education = z.infer<typeof educationSchema>;
type Language = z.infer<typeof languageSchema>;

const CVManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvId, setCvId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
  });

  useEffect(() => {
    fetchCVData();
  }, []);

  const fetchCVData = async () => {
    try {
      const { data, error } = await supabase
        .from("cv_data")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCvId(data.id);
        reset({
          full_name: data.full_name,
          title: data.title,
          email: data.email,
          phone: data.phone || "",
          location: data.location || "",
          summary: data.summary || "",
        });
        setExperiences((data.experiences as Experience[]) || []);
        setEducation((data.education as Education[]) || []);
        setLanguages((data.languages as Language[]) || []);
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
      toast.error("Erreur lors du chargement du CV");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: CVFormData) => {
    setSaving(true);
    try {
      const cvData = {
        ...formData,
        experiences,
        education,
        languages,
      };

      if (cvId) {
        const { error } = await supabase
          .from("cv_data")
          .update(cvData)
          .eq("id", cvId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("cv_data")
          .insert(cvData)
          .select()
          .single();
        if (error) throw error;
        setCvId(data.id);
      }

      toast.success("CV sauvegardé avec succès");
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, { company: "", position: "", startDate: "", endDate: "", description: "" }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", startDate: "", endDate: "" }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    setLanguages([...languages, { name: "", level: "" }]);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input id="full_name" {...register("full_name")} />
              {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titre professionnel *</Label>
              <Input id="title" {...register("title")} placeholder="Ex: Développeur Full Stack" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Localisation</Label>
              <Input id="location" {...register("location")} placeholder="Ex: Paris, France" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Résumé</Label>
            <Textarea id="summary" {...register("summary")} rows={4} placeholder="Décrivez brièvement votre profil..." />
          </div>
        </CardContent>
      </Card>

      {/* Experiences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expériences professionnelles</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addExperience}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-medium">Expérience {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input value={exp.position} onChange={(e) => updateExperience(index, "position", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} placeholder="Ex: Janvier 2020" />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input value={exp.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} placeholder="Ex: Présent" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} rows={3} />
              </div>
            </div>
          ))}
          {experiences.length === 0 && <p className="text-muted-foreground text-center py-4">Aucune expérience ajoutée</p>}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Formation</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addEducation}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-medium">Formation {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>École / Université</Label>
                  <Input value={edu.school} onChange={(e) => updateEducation(index, "school", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Diplôme</Label>
                  <Input value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input value={edu.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} placeholder="Ex: 2018" />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input value={edu.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} placeholder="Ex: 2021" />
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && <p className="text-muted-foreground text-center py-4">Aucune formation ajoutée</p>}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Langues</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label>Langue</Label>
                <Input value={lang.name} onChange={(e) => updateLanguage(index, "name", e.target.value)} placeholder="Ex: Anglais" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Niveau</Label>
                <Input value={lang.level} onChange={(e) => updateLanguage(index, "level", e.target.value)} placeholder="Ex: Courant" />
              </div>
              <Button type="button" variant="ghost" size="sm" className="mt-6" onClick={() => removeLanguage(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {languages.length === 0 && <p className="text-muted-foreground text-center py-4">Aucune langue ajoutée</p>}
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Sauvegarder le CV
      </Button>
    </form>
  );
};

export default CVManager;
