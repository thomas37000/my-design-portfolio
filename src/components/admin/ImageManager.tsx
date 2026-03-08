import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressToWebP } from "@/lib/imageCompression";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Trash2,
  Copy,
  RefreshCw,
  Loader2,
  Image,
  FolderPlus,
  Search,
  Database,
  Pencil,
  Plus,
} from "lucide-react";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata: { size: number; mimetype: string } | null;
  publicUrl: string;
  folder: string;
}

interface BucketInfo {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
}

const ImageManager = () => {
  // Bucket state
  const [buckets, setBuckets] = useState<BucketInfo[]>([]);
  const [currentBucket, setCurrentBucket] = useState<string>("");
  const [bucketsLoading, setBucketsLoading] = useState(true);
  const [newBucketOpen, setNewBucketOpen] = useState(false);
  const [newBucketId, setNewBucketId] = useState("");
  const [newBucketPublic, setNewBucketPublic] = useState(true);
  const [renameBucketTarget, setRenameBucketTarget] = useState<BucketInfo | null>(null);
  const [renameBucketPublic, setRenameBucketPublic] = useState(true);
  const [deleteBucketTarget, setDeleteBucketTarget] = useState<BucketInfo | null>(null);
  const [deleteBucketConfirm, setDeleteBucketConfirm] = useState("");
  const [bucketActionLoading, setBucketActionLoading] = useState(false);

  // File state
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<StorageFile | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<StorageFile | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { toast } = useToast();

  const callBucketApi = async (body: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-buckets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(body),
      }
    );
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.data;
  };

  // Fetch buckets
  const fetchBuckets = useCallback(async () => {
    setBucketsLoading(true);
    try {
      const data = await callBucketApi({ action: "list" });
      setBuckets(data || []);
      // Auto-select first bucket if none selected
      if (!currentBucket && data?.length > 0) {
        setCurrentBucket(data[0].id);
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les buckets", variant: "destructive" });
    } finally {
      setBucketsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBuckets();
  }, [fetchBuckets]);

  // Fetch files when bucket or folder changes
  const fetchFiles = useCallback(async () => {
    if (!currentBucket) return;
    setLoading(true);
    try {
      const { data: rootData } = await supabase.storage
        .from(currentBucket)
        .list("", { limit: 200, sortBy: { column: "name", order: "asc" } });

      const detectedFolders: string[] = [];
      if (rootData) {
        rootData.forEach((item) => {
          if (item.id === null) detectedFolders.push(item.name);
        });
      }
      setFolders(detectedFolders);

      const { data, error } = await supabase.storage
        .from(currentBucket)
        .list(currentFolder || "", {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const imageFiles: StorageFile[] = (data || [])
        .filter((f) => f.id !== null && f.name !== ".keep")
        .map((f) => {
          const path = currentFolder ? `${currentFolder}/${f.name}` : f.name;
          const { data: urlData } = supabase.storage
            .from(currentBucket)
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
      toast({ title: "Erreur", description: "Impossible de charger les images", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [currentBucket, currentFolder, toast]);

  useEffect(() => {
    setCurrentFolder("");
    setFiles([]);
    setFolders([]);
    if (currentBucket) fetchFiles();
  }, [currentBucket]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentBucket) fetchFiles();
  }, [currentFolder]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bucket CRUD
  const handleCreateBucket = async () => {
    if (!newBucketId.trim()) return;
    setBucketActionLoading(true);
    try {
      await callBucketApi({
        action: "create",
        bucketId: newBucketId.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        bucketName: newBucketId.trim(),
        isPublic: newBucketPublic,
      });
      toast({ title: "Succès", description: `Bucket "${newBucketId.trim()}" créé` });
      setNewBucketId("");
      setNewBucketOpen(false);
      await fetchBuckets();
      setCurrentBucket(newBucketId.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setBucketActionLoading(false);
    }
  };

  const handleUpdateBucket = async () => {
    if (!renameBucketTarget) return;
    setBucketActionLoading(true);
    try {
      await callBucketApi({
        action: "update",
        bucketId: renameBucketTarget.id,
        isPublic: renameBucketPublic,
      });
      toast({ title: "Succès", description: "Bucket mis à jour" });
      setRenameBucketTarget(null);
      fetchBuckets();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setBucketActionLoading(false);
    }
  };

  const handleDeleteBucket = async () => {
    if (!deleteBucketTarget || deleteBucketConfirm !== deleteBucketTarget.id) return;
    setBucketActionLoading(true);
    try {
      await callBucketApi({ action: "delete", bucketId: deleteBucketTarget.id });
      toast({ title: "Succès", description: `Bucket "${deleteBucketTarget.id}" supprimé avec toutes ses images` });
      setDeleteBucketTarget(null);
      setDeleteBucketConfirm("");
      if (currentBucket === deleteBucketTarget.id) setCurrentBucket("");
      fetchBuckets();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setBucketActionLoading(false);
    }
  };

  // File operations
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !currentBucket) return;

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      const compressed = await compressToWebP(file);
      const ext = compressed.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const path = currentFolder ? `${currentFolder}/${fileName}` : fileName;

      const { error } = await supabase.storage
        .from(currentBucket)
        .upload(path, compressed, { cacheControl: "3600", upsert: false });

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
    if (!replaceTarget || !e.target.files?.[0] || !currentBucket) return;

    const file = await compressToWebP(e.target.files[0]);
    const path = replaceTarget.folder
      ? `${replaceTarget.folder}/${replaceTarget.name}`
      : replaceTarget.name;

    setUploading(true);
    const { error } = await supabase.storage
      .from(currentBucket)
      .update(path, file, { cacheControl: "3600", upsert: true });

    if (error) {
      toast({ title: "Erreur", description: "Impossible de remplacer l'image", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Image remplacée" });
    }

    setUploading(false);
    setReplaceTarget(null);
    e.target.value = "";
    fetchFiles();
  };

  const handleDelete = async () => {
    if (!deleteTarget || !currentBucket) return;

    const path = deleteTarget.folder
      ? `${deleteTarget.folder}/${deleteTarget.name}`
      : deleteTarget.name;

    const { error } = await supabase.storage.from(currentBucket).remove([path]);

    if (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'image", variant: "destructive" });
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

  const [compressing, setCompressing] = useState<string | null>(null);

  const compressFile = async (file: StorageFile) => {
    if (!currentBucket) return;
    setCompressing(file.name);
    try {
      // Download original
      const { data: blob, error: dlError } = await supabase.storage
        .from(currentBucket)
        .download(file.folder ? `${file.folder}/${file.name}` : file.name);
      if (dlError || !blob) throw dlError;

      const originalFile = new File([blob], file.name, { type: blob.type });
      const compressed = await compressToWebP(originalFile);

      if (compressed === originalFile) {
        toast({ title: "Déjà optimisé", description: "L'image est déjà au format optimal." });
        return;
      }

      const oldPath = file.folder ? `${file.folder}/${file.name}` : file.name;
      const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
      const newPath = file.folder ? `${file.folder}/${newName}` : newName;

      // Upload compressed
      const { error: upError } = await supabase.storage
        .from(currentBucket)
        .upload(newPath, compressed, { cacheControl: "3600", upsert: false });
      if (upError) throw upError;

      // Delete original if name changed
      if (oldPath !== newPath) {
        await supabase.storage.from(currentBucket).remove([oldPath]);
      }

      toast({ title: "Compressé en WebP", description: `${formatSize(originalFile.size)} → ${formatSize(compressed.size)}` });
      fetchFiles();
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.message || "Échec de la compression", variant: "destructive" });
    } finally {
      setCompressing(null);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !currentBucket) return;
    const folderPath = currentFolder
      ? `${currentFolder}/${newFolderName.trim()}/.keep`
      : `${newFolderName.trim()}/.keep`;

    const { error } = await supabase.storage
      .from(currentBucket)
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

  const currentBucketInfo = buckets.find((b) => b.id === currentBucket);

  return (
    <div className="space-y-6">
      {/* Bucket management bar */}
      <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Buckets de stockage</span>
        </div>

        {bucketsLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {buckets.map((bucket) => (
              <div
                key={bucket.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer transition-colors ${
                  currentBucket === bucket.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCurrentBucket(bucket.id)}
              >
                <span className="text-sm font-medium">{bucket.id}</span>
                {bucket.public && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    public
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameBucketTarget(bucket);
                    setRenameBucketPublic(bucket.public);
                  }}
                  title="Modifier"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteBucketTarget(bucket);
                    setDeleteBucketConfirm("");
                  }}
                  title="Supprimer"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={() => setNewBucketOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Nouveau bucket
            </Button>
          </div>
        )}
      </div>

      {/* File toolbar */}
      {currentBucket && (
        <>
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

            {folders.length > 0 && (
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
            )}

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
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => compressFile(file)}
                        disabled={compressing === file.name || file.name.endsWith(".webp")}
                        title="Compresser en WebP"
                      >
                        {compressing === file.name ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Image className="h-3.5 w-3.5" />}
                      </Button>
                      <label
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors"
                        title="Uploader une nouvelle version"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (e) => {
                            if (!e.target.files?.[0] || !currentBucket) return;
                            const compressed = await compressToWebP(e.target.files[0]);
                            const path = file.folder ? `${file.folder}/${file.name}` : file.name;
                            setUploading(true);
                            const { error } = await supabase.storage
                              .from(currentBucket)
                              .update(path, compressed, { cacheControl: "3600", upsert: true });
                            setUploading(false);
                            if (error) {
                              toast({ title: "Erreur", description: "Impossible de remplacer l'image", variant: "destructive" });
                            } else {
                              toast({ title: "Succès", description: "Image remplacée" });
                              fetchFiles();
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
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
        </>
      )}

      {!currentBucket && !bucketsLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <Database className="h-12 w-12" />
          <p>Sélectionnez ou créez un bucket pour gérer les images</p>
        </div>
      )}

      {/* === DIALOGS === */}

      {/* Create bucket */}
      <Dialog open={newBucketOpen} onOpenChange={setNewBucketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau bucket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du bucket</Label>
              <Input
                value={newBucketId}
                onChange={(e) => setNewBucketId(e.target.value)}
                placeholder="ex: project-images, avatars, logos..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateBucket();
                }}
              />
              <p className="text-xs text-muted-foreground">
                Lettres minuscules, chiffres et tirets uniquement.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="bucket-public"
                checked={newBucketPublic}
                onCheckedChange={setNewBucketPublic}
              />
              <Label htmlFor="bucket-public">Bucket public (images accessibles sans authentification)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewBucketOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateBucket} disabled={!newBucketId.trim() || bucketActionLoading}>
              {bucketActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update bucket */}
      <Dialog open={!!renameBucketTarget} onOpenChange={() => setRenameBucketTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le bucket "{renameBucketTarget?.id}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="rename-bucket-public"
                checked={renameBucketPublic}
                onCheckedChange={setRenameBucketPublic}
              />
              <Label htmlFor="rename-bucket-public">Bucket public</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Note : Le nom d'un bucket ne peut pas être modifié dans Supabase. Vous pouvez uniquement changer sa visibilité (public/privé).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameBucketTarget(null)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateBucket} disabled={bucketActionLoading}>
              {bucketActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete bucket - with typed confirmation */}
      <Dialog open={!!deleteBucketTarget} onOpenChange={() => { setDeleteBucketTarget(null); setDeleteBucketConfirm(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              ⚠️ Supprimer le bucket "{deleteBucketTarget?.id}" ?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5 space-y-2">
              <p className="text-sm font-semibold text-destructive">
                Cette action est irréversible !
              </p>
              <p className="text-sm text-muted-foreground">
                Le bucket <strong>"{deleteBucketTarget?.id}"</strong> et <strong>toutes les images qu'il contient</strong> seront définitivement supprimés.
                Les URLs de ces images ne fonctionneront plus.
              </p>
            </div>
            <div className="space-y-2">
              <Label>
                Tapez <strong className="text-destructive">{deleteBucketTarget?.id}</strong> pour confirmer
              </Label>
              <Input
                value={deleteBucketConfirm}
                onChange={(e) => setDeleteBucketConfirm(e.target.value)}
                placeholder={deleteBucketTarget?.id}
                className="border-destructive/50 focus-visible:ring-destructive"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteBucketTarget(null); setDeleteBucketConfirm(""); }}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBucket}
              disabled={deleteBucketConfirm !== deleteBucketTarget?.id || bucketActionLoading}
            >
              {bucketActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace image */}
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

      {/* Delete image confirmation */}
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

      {/* New folder */}
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
