import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, Image, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressToWebP } from "@/lib/imageCompression";
import StoragePicker from "./StoragePicker";

const BUCKET = "project-images";

interface ImagesManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImagesManager = ({ images, onChange }: ImagesManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const addImage = () => {
    if (newImageUrl.trim()) {
      onChange([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const pickFromStorage = (url: string) => {
    if (replaceIndex !== null) {
      const newImages = [...images];
      newImages[replaceIndex] = url;
      onChange(newImages);
      setReplaceIndex(null);
    } else if (!images.includes(url)) {
      onChange([...images, url]);
    }
  };

  const openPickerForReplace = (index: number) => {
    setReplaceIndex(index);
    setPickerOpen(true);
  };

  const openPickerForAdd = () => {
    setReplaceIndex(null);
    setPickerOpen(true);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(fileList)) {
      const compressed = await compressToWebP(file);
      const ext = compressed.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, compressed, { cacheControl: "3600", upsert: false });

      if (!error) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        newUrls.push(urlData.publicUrl);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }

    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <Label>Images du projet</Label>

      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <div className="h-12 w-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
              </div>
              <span className="flex-1 text-sm truncate text-muted-foreground">{img}</span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveImage(index, index - 1)} disabled={index === 0}>↑</Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveImage(index, index + 1)} disabled={index === images.length - 1}>↓</Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPickerForReplace(index)} title="Modifier depuis la bibliothèque"><Pencil className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeImage(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2 flex-1 min-w-48">
          <Input
            type="url"
            placeholder="URL de l'image"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
          />
          <Button type="button" variant="outline" onClick={addImage} disabled={!newImageUrl.trim()}>
            <Plus className="h-4 w-4 mr-1" />URL
          </Button>
        </div>
        <Button type="button" variant="outline" onClick={openPickerForAdd}>
          <Image className="h-4 w-4 mr-1" />Bibliothèque
        </Button>
        <div className="relative">
          <Label
            htmlFor="direct-upload"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </Label>
          <input id="direct-upload" type="file" accept="image/*" multiple className="sr-only" onChange={handleDirectUpload} disabled={uploading} />
        </div>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucune image ajoutée. Utilisez les options ci-dessus pour ajouter des images.
        </p>
      )}

      <StoragePicker
        open={pickerOpen}
        onOpenChange={(open) => { setPickerOpen(open); if (!open) setReplaceIndex(null); }}
        title={replaceIndex !== null ? "Remplacer l'image depuis la bibliothèque" : "Choisir une image de la bibliothèque"}
        onPick={pickFromStorage}
      />
    </div>
  );
};

export default ImagesManager;
