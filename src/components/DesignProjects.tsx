import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DesignProjectCard from "./DesignProjectCard";
import { Designer_project } from "@/types";
import HorizontalGallery from "./HorizontalGallery";
import ProjectsGrid from "./ProjectsGrid";
import { useDisplayMode } from "@/hooks/useDisplayMode";
import { useIsMobile } from "@/hooks/use-mobile";

const DesignProjects = () => {
  const [projects, setProjects] = useState<Designer_project[]>([]);
  const [loading, setLoading] = useState(true);
  const { displayMode, loading: modeLoading } = useDisplayMode();
  const isMobile = useIsMobile();

  useEffect(() => {
    getProjects();
  }, []);

  async function getProjects() {
    try {
      const { data, error } = await supabase
        .from("designer_projects")
        .select("*")
        .order("year", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setProjects(data as unknown as Designer_project[]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || modeLoading) {
    return (
      <section id="design-projects" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  const projectCards = projects.map((project) => (
    <DesignProjectCard key={project.id} {...project} />
  ));

  // Force horizontal gallery on mobile, use grid only on desktop when setting is "grid"
  if (displayMode === "grid" && !isMobile) {
    return (
      <ProjectsGrid id="design-projects" title="Projets Web Design" className="bg-muted/30">
        {projectCards}
      </ProjectsGrid>
    );
  }

  return (
    <HorizontalGallery id="design-projects" title="Projets Web Design" className="bg-muted/30">
      {projectCards}
    </HorizontalGallery>
  );
};

export default DesignProjects;