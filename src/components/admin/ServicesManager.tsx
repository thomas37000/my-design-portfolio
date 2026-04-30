import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import DynamicIcon from "@/components/DynamicIcon";
import { useServices, Service, ServiceInput } from "@/hooks/useServices";
import { toast } from "@/hooks/use-toast";

const emptyForm: ServiceInput = {
  title: "",
  price: "",
  description: "",
  icon: "Sparkles",
  features: [],
  technos: [],
  display_order: 0,
};

const ServicesManager = () => {
  const { services, loading, createService, updateService, deleteService } = useServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [featuresText, setFeaturesText] = useState("");
  const [technosText, setTechnosText] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, display_order: services.length + 1 });
    setFeaturesText("");
    setTechnosText("");
    setDialogOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      price: s.price,
      description: s.description,
      icon: s.icon,
      features: s.features,
      technos: s.technos,
      display_order: s.display_order,
    });
    setFeaturesText(s.features.join("\n"));
    setTechnosText(s.technos.join(", "));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Le titre est requis", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload: ServiceInput = {
        ...form,
        features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
        technos: technosText.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await updateService(editing.id, payload);
        toast({ title: "Service mis à jour" });
      } else {
        await createService(payload);
        toast({ title: "Service créé" });
      }
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur lors de l'enregistrement", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast({ title: "Service supprimé" });
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter un service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier le service" : "Nouveau service"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Création de site internet"
                  />
                </div>
                <div>
                  <Label>Prix</Label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="À partir de 800€"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Icône (Lucide)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      placeholder="Globe"
                    />
                    <div className="w-10 h-10 flex items-center justify-center border rounded-md bg-muted">
                      <DynamicIcon name={form.icon} className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nom Lucide ex: Globe, Wrench, Palette, Sticker, Sparkles
                  </p>
                </div>
                <div>
                  <Label>Ordre d'affichage</Label>
                  <Input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Caractéristiques (une par ligne)</Label>
                <Textarea
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  rows={4}
                  placeholder="Design sur mesure&#10;Optimisation SEO&#10;..."
                />
              </div>

              <div>
                <Label>Technos / Outils (séparés par virgules)</Label>
                <Input
                  value={technosText}
                  onChange={(e) => setTechnosText(e.target.value)}
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Aucun service pour le moment.</p>
      ) : (
        <div className="grid gap-3">
          {services.map((s) => (
            <Card key={s.id} className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <DynamicIcon name={s.icon} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{s.title}</h3>
                  <span className="text-sm text-primary">{s.price}</span>
                  <span className="text-xs text-muted-foreground">#{s.display_order}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action supprimera définitivement « {s.title} ».
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(s.id)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
