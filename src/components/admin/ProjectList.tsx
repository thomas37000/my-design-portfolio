import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2, ExternalLink, Eye, EyeOff } from "lucide-react";

interface ProjectListProps {
  projects: any[];
  loading: boolean;
  onEdit: (project: any) => void;
  onDelete: (id: number) => void;
  onToggleVisibility?: (id: number, hidden: boolean) => void;
  projectType: "dev" | "design";
}

const ProjectList = ({ projects, loading, onEdit, onDelete, onToggleVisibility, projectType }: ProjectListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun projet pour le moment
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{project.titre || project.nom_projet}</h3>
                  {project.hidden && (
                    <Badge variant="destructive">Caché</Badge>
                  )}
                  {project.fini && (
                    <Badge variant="secondary">Terminé</Badge>
                  )}
                  {project.IA && (
                    <Badge variant="outline">IA</Badge>
                  )}
                </div>
                
                {project.description && (
                  <p className="text-muted-foreground">{project.description}</p>
                )}

                {project.organisme && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Organisme:</span> {project.organisme}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {projectType === "dev" && project.technos?.map((tech: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{tech}</Badge>
                  ))}
                  {projectType === "design" && project.logiciels?.map((logiciel: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{logiciel}</Badge>
                  ))}
                  {projectType === "design" && project.tags?.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  {project.lien_url && (
                    <a href={project.lien_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Voir le projet
                      </Button>
                    </a>
                  )}
                  {projectType === "dev" && project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        GitHub
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {projectType === "dev" && onToggleVisibility && (
                  <Button
                    variant={project.hidden ? "default" : "outline"}
                    size="icon"
                    onClick={() => onToggleVisibility(project.id, !project.hidden)}
                    title={project.hidden ? "Afficher le projet" : "Cacher le projet"}
                  >
                    {project.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
