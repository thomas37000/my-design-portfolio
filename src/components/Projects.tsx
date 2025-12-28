import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "./ProjectCard";
import { Dev_project } from "@/types";
import HorizontalGallery from "./HorizontalGallery";

const Projects = () => {
  const [projects, setProjects] = useState<Dev_project[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  return (
    <div id="projects">
      <HorizontalGallery title="Mes Projets">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </HorizontalGallery>
    </div>
  );
};

export default Projects;
