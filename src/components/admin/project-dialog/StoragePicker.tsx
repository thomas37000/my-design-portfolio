import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StorageImage {
  name: string;
  publicUrl: string;
}

interface StoragePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onPick: (url: string) => void;
}

const DEFAULT_BUCKET = "cv-files";

const StoragePicker = ({ open, onOpenChange, title = "Choisir une image", onPick }: StoragePickerProps) => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState(DEFAULT_BUCKET);
  const [currentFolder, setCurrentFolder] = useState("");
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const [items, setItems] = useState<{ folders: string[]; images: StorageImage[] }>({ folders: [], images: [] });
  const [loading, setLoading] = useState(false);

  const fetchBuckets = useCallback(async () => {
    const { data } = await supabase.storage.listBuckets();
    if (data) {
      setBuckets(data.map((b) => b.name));
    }
  }, []);

  const fetchFolder = useCallback(async (bucket: string, folder: string) => {
    setLoading(true);
    try {
      const { data } = await supabase.storage
        .from(bucket)
        .list(folder, { limit: 500, sortBy: { column: "created_at", order: "desc" } });

      if (!data) {
        setItems({ folders: [], images: [] });
        return;
      }

      const folders: string[] = [];
      const images: StorageImage[] = [];

      for (const item of data) {
        if (item.name === ".keep" || item.name === ".emptyFolderPlaceholder") continue;
        const path = folder ? `${folder}/${item.name}` : item.name;
        if (item.id === null) {
          folders.push(item.name);
        } else {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
          images.push({ name: path, publicUrl: urlData.publicUrl });
        }
      }

      setItems({ folders, images });
    } catch {
      setItems({ folders: [], images: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchBuckets();
      setCurrentFolder("");
      setFolderStack([]);
    }
  }, [open, fetchBuckets]);

  useEffect(() => {
    if (open) {
      fetchFolder(selectedBucket, currentFolder);
    }
  }, [open, selectedBucket, currentFolder, fetchFolder]);

  const enterFolder = (folderName: string) => {
    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
    setFolderStack((prev) => [...prev, currentFolder]);
    setCurrentFolder(newPath);
  };

  const goBack = () => {
    const prev = folderStack[folderStack.length - 1] ?? "";
    setFolderStack((s) => s.slice(0, -1));
    setCurrentFolder(prev);
  };

  const handleBucketChange = (bucket: string) => {
    setSelectedBucket(bucket);
    setCurrentFolder("");
    setFolderStack([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Bucket selector + navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={selectedBucket} onValueChange={handleBucketChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Bucket" />
            </SelectTrigger>
            <SelectContent>
              {buckets.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentFolder && (
            <Button type="button" variant="ghost" size="sm" onClick={goBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
          )}

          {currentFolder && (
            <span className="text-sm text-muted-foreground truncate">/{currentFolder}</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.folders.length === 0 && items.images.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            Aucun fichier dans ce dossier.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Folders */}
            {items.folders.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {items.folders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => enterFolder(folder)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                  >
                    <FolderOpen className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-center truncate w-full">{folder}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Images */}
            {items.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {items.images.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => {
                      onPick(img.publicUrl);
                      onOpenChange(false);
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoragePicker;
