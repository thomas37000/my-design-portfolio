import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Image, Loader2, Pencil } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressToWebP } from "@/lib/imageCompression";

const BUCKET = "project-images";

interface StorageImage {
  name: string;
  publicUrl: string;
}

interface ImagesManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImagesManager = ({ images, onChange }: ImagesManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchStorageImages = useCallback(async () => {
    setStorageLoading(true);
    try {
      // Recursively list all folders and files
      const allImages: StorageImage[] = [];

      const listFolder = async (folder: string) => {
        const { data } = await supabase.storage
          .from(BUCKET)
          .list(folder, { limit: 500, sortBy: { column: "created_at", order: "desc" } });

        if (!data) return;

        for (const item of data) {
          const path = folder ? `${folder}/${item.name}` : item.name;
          if (item.id === null) {
            // It's a folder, recurse
            await listFolder(path);
          } else if (item.name !== ".keep") {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
            allImages.push({ name: path, publicUrl: urlData.publicUrl });
          }
        }
      };

      await listFolder("");
      setStorageImages(allImages);
    } catch {
      // ignore
    } finally {
      setStorageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pickerOpen) fetchStorageImages();
  }, [pickerOpen, fetchStorageImages]);

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
    setPickerOpen(false);
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

      {/* Current images list */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted rounded-lg"
            >
              <div className="h-12 w-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>

              <span className="flex-1 text-sm truncate text-muted-foreground">
                {img}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add image actions */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2 flex-1 min-w-48">
          <Input
            type="url"
            placeholder="URL de l'image"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addImage}
            disabled={!newImageUrl.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            URL
          </Button>
        </div>

        <Button type="button" variant="outline" onClick={() => setPickerOpen(true)}>
          <Image className="h-4 w-4 mr-1" />
          Bibliothèque
        </Button>

        <div className="relative">
          <Label
            htmlFor="direct-upload"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </Label>
          <input
            id="direct-upload"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleDirectUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucune image ajoutée. Utilisez les options ci-dessus pour ajouter des images.
        </p>
      )}

      {/* Storage picker dialog */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisir une image de la bibliothèque</DialogTitle>
          </DialogHeader>
          {storageLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : storageImages.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              Aucune image disponible. Uploadez des images via l'onglet "Images" du tableau de bord.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {storageImages.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => pickFromStorage(img.publicUrl)}
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
    </div>
  );
};

export default ImagesManager;
