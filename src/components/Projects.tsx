import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "./ProjectCard";
import { Dev_project } from "@/types";



const Projects = () => {
  const [projects, setProjects] = useState<Dev_project[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(projects);

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
        setError(error);
      } else {
        setProjects(data as unknown as Dev_project[]);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Mes Projets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<p>Loading...</p>}>
            {projects.map((project, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </Suspense>

        </div>
      </div>
    </section>
  );
};

export default Projects;
