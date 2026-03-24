import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Download, Copy, Upload } from "lucide-react";

interface AIImageGeneratorProps {
  buckets: { id: string; name: string; public: boolean }[];
  currentBucket: string;
  currentFolder: string;
  onImageUploaded: () => void;
}

const AIImageGenerator = ({ buckets, currentBucket, currentFolder, onImageUploaded }: AIImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadBucket, setUploadBucket] = useState(currentBucket || "project-images");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: prompt.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("Aucune image générée");

      setGeneratedImage(data.imageUrl);
      toast({ title: "Image générée !", description: "Vous pouvez maintenant la sauvegarder dans un bucket." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message || "Échec de la génération", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToBucket = async () => {
    if (!generatedImage || !uploadBucket) return;
    setSaving(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: prompt.trim(), bucketName: uploadBucket, folderPath: currentFolder },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Sauvegardée !", description: `Image ajoutée dans ${uploadBucket}` });
      setGeneratedImage(null);
      setPrompt("");
      onImageUploaded();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message || "Échec de la sauvegarde", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `ai-image-${Date.now()}.png`;
    a.click();
  };

  const handleCopyUrl = () => {
    if (!generatedImage) return;
    navigator.clipboard.writeText(generatedImage);
    toast({ title: "URL copiée" });
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Génération d'images par IA</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-prompt">Décrivez l'image souhaitée</Label>
        <Textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Un paysage futuriste avec des montagnes et un coucher de soleil..."
          rows={3}
          className="resize-none"
        />
      </div>

      <Button onClick={handleGenerate} disabled={generating || !prompt.trim()}>
        {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
        {generating ? "Génération en cours..." : "Générer l'image"}
      </Button>

      {generatedImage && (
        <div className="space-y-3 pt-2">
          <div className="rounded-lg overflow-hidden border border-border max-w-md">
            <img src={generatedImage} alt="Image générée par IA" className="w-full h-auto" />
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Sauvegarder dans</Label>
              <Select value={uploadBucket} onValueChange={setUploadBucket}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveToBucket} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Sauvegarder
            </Button>

            <Button variant="outline" size="icon" onClick={handleDownload} title="Télécharger">
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handleCopyUrl} title="Copier l'URL">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImageGenerator;
