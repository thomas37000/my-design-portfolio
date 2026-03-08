import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Trash2, Copy, RefreshCw, Loader2, Image, FolderPlus, Search } from "lucide-react";

const BUCKET = "project-images";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata: { size: number; mimetype: string } | null;
  publicUrl: string;
  folder: string;
}

const ImageManager = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StorageFile | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<StorageFile | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      // List folders at root
      const { data: rootData } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 200, sortBy: { column: "name", order: "asc" } });

      const detectedFolders: string[] = [];
      if (rootData) {
        rootData.forEach((item) => {
          if (item.id === null) {
            detectedFolders.push(item.name);
          }
        });
      }
      setFolders(detectedFolders);

      // List files in current folder
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(currentFolder || "", {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const imageFiles: StorageFile[] = (data || [])
        .filter((f) => f.id !== null) // exclude folders
        .map((f) => {
          const path = currentFolder ? `${currentFolder}/${f.name}` : f.name;
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(path);
          return {
            name: f.name,
            id: f.id!,
            created_at: f.created_at!,
            metadata: f.metadata as any,
            publicUrl: urlData.publicUrl,
            folder: currentFolder,
          };
        });

      setFiles(imageFiles);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger les images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentFolder, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const path = currentFolder ? `${currentFolder}/${fileName}` : fileName;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (!error) successCount++;
    }

    toast({
      title: "Upload terminé",
      description: `${successCount}/${fileList.length} image(s) uploadée(s)`,
    });

    setUploading(false);
    e.target.value = "";
    fetchFiles();
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!replaceTarget || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const path = replaceTarget.folder
      ? `${replaceTarget.folder}/${replaceTarget.name}`
      : replaceTarget.name;

    setUploading(true);
    const { error } = await supabase.storage
      .from(BUCKET)
      .update(path, file, { cacheControl: "3600", upsert: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de remplacer l'image",
        variant: "destructive",
      });
    } else {
      toast({ title: "Succès", description: "Image remplacée" });
    }

    setUploading(false);
    setReplaceTarget(null);
    e.target.value = "";
    fetchFiles();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const path = deleteTarget.folder
      ? `${deleteTarget.folder}/${deleteTarget.name}`
      : deleteTarget.name;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    } else {
      toast({ title: "Succès", description: "Image supprimée" });
      fetchFiles();
    }
    setDeleteTarget(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copiée", description: "L'URL a été copiée dans le presse-papiers" });
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const folderPath = currentFolder
      ? `${currentFolder}/${newFolderName.trim()}/.keep`
      : `${newFolderName.trim()}/.keep`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(folderPath, new Blob([""], { type: "text/plain" }), { upsert: true });

    if (error) {
      toast({ title: "Erreur", description: "Impossible de créer le dossier", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: `Dossier "${newFolderName.trim()}" créé` });
      setNewFolderName("");
      setNewFolderOpen(false);
      fetchFiles();
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Label
            htmlFor="upload-input"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Uploader des images
          </Label>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>

        <Button variant="outline" size="sm" onClick={() => setNewFolderOpen(true)}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>

        <Button variant="ghost" size="sm" onClick={fetchFiles} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>

        {/* Folder navigation */}
        <Select value={currentFolder || "__root__"} onValueChange={(v) => setCurrentFolder(v === "__root__" ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Racine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__root__">📁 Racine</SelectItem>
            {folders.map((f) => (
              <SelectItem key={f} value={f}>
                📁 {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 min-w-48">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une image..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <Image className="h-12 w-12" />
          <p>Aucune image dans ce dossier</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="group relative border border-border rounded-lg overflow-hidden bg-muted/30"
            >
              <div className="aspect-square">
                <img
                  src={file.publicUrl}
                  alt={file.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-xs font-medium text-center truncate w-full px-1">
                  {file.name}
                </p>
                {file.metadata?.size && (
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.metadata.size)}
                  </p>
                )}
                <div className="flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => copyUrl(file.publicUrl)} title="Copier l'URL">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setReplaceTarget(file)} title="Remplacer">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteTarget(file)} title="Supprimer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Replace dialog - hidden file input */}
      {replaceTarget && (
        <Dialog open={!!replaceTarget} onOpenChange={() => setReplaceTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remplacer l'image</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Remplacer <strong>{replaceTarget.name}</strong> par une nouvelle image.
            </p>
            <div className="flex justify-center py-4">
              <img
                src={replaceTarget.publicUrl}
                alt={replaceTarget.name}
                className="max-h-40 rounded-lg object-contain"
              />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleReplace}
              disabled={uploading}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setReplaceTarget(null)}>
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'image ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'image <strong>{deleteTarget?.name}</strong> sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New folder dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau dossier</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom du dossier</Label>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="ex: design, dev, logos..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageManager;
