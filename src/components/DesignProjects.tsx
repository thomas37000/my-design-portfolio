import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DesignProjectCard from "./DesignProjectCard";
import { Designer_project } from "@/types";
import HorizontalGallery from "./HorizontalGallery";

const DesignProjects = () => {
  const [projects, setProjects] = useState<Designer_project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects();
  }, []);

  async function getProjects() {
    try {
      const { data, error } = await supabase
        .from("designer_projects")
        .select("*")
        .order("created_at", { ascending: false });

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

  if (loading) {
    return (
      <section id="design-projects" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  return (
    <div id="design-projects">
      <HorizontalGallery title="Projets Web Design" className="bg-muted/30">
        {projects.map((project) => (
          <DesignProjectCard key={project.id} {...project} />
        ))}
      </HorizontalGallery>
    </div>
  );
};

export default DesignProjects;