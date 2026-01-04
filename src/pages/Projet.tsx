import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Designer_project } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";

const Projet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Designer_project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  async function fetchProject() {
    try {
      const { data, error } = await supabase
        .from("designer_projects")
        .select("*")
        .eq("id", parseInt(id!))
        .single();

      if (error) {
        console.error(error);
      } else {
        setProject(data as unknown as Designer_project);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        <article className="max-w-4xl mx-auto">
          {project.img && (
            <div className="relative overflow-hidden rounded-lg mb-8 aspect-video">
              <img
                src={project.img}
                alt={project.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{project.titre}</h1>
            {project.organisme && (
              <p className="text-lg text-muted-foreground">{project.organisme}</p>
            )}
          </header>

          <section className="prose prose-lg max-w-none mb-8">
            <p className="text-foreground text-lg leading-relaxed">{project.description}</p>
          </section>

          {project.lien_url && (
            <div className="mb-8">
              <Button
                onClick={() => window.open(project.lien_url, "_blank")}
                size="lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir le projet
              </Button>
            </div>
          )}

          {project.logiciels && project.logiciels.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Logiciels utilisés</h2>
              <div className="flex flex-wrap gap-2">
                {project.logiciels.map((logiciel, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {logiciel}
                  </span>
                ))}
              </div>
            </section>
          )}

          {project.tags && project.tags.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
};

export default Projet;
