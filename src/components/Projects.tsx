import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "./ProjectCard";
import { Dev_project } from "@/types";
import HorizontalGallery from "./HorizontalGallery";
import ProjectsGrid from "./ProjectsGrid";
import { useDisplayMode } from "@/hooks/useDisplayMode";

const Projects = () => {
  const [projects, setProjects] = useState<Dev_project[]>([]);
  const [loading, setLoading] = useState(true);
  const { displayMode, loading: modeLoading } = useDisplayMode();

  useEffect(() => {
    getProjects();
  }, []);

  async function getProjects() {
    try {
      const { data, error } = await supabase
        .from("dev_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setProjects(data as unknown as Dev_project[]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || modeLoading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  const projectCards = projects.map((project) => (
    <ProjectCard key={project.id} {...project} />
  ));

  if (displayMode === "grid") {
    return (
      <ProjectsGrid id="projects" title="Mes Projets">
        {projectCards}
      </ProjectsGrid>
    );
  }

  return (
    <HorizontalGallery id="projects" title="Mes Projets">
      {projectCards}
    </HorizontalGallery>
  );
};

export default Projects;
