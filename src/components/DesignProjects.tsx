import { useState, useEffect, useRef, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import DesignProjectCard from "./DesignProjectCard";
import { Designer_project } from "@/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DesignProjects = () => {
  const [projects, setProjects] = useState<Designer_project[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (loading || projects.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        gridRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, projects]);

  async function getProjects() {
    try {
      const { data, error } = await supabase
        .from("designer_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError(error);
      } else {
        setProjects(data as unknown as Designer_project[]);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section ref={sectionRef} id="design-projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-4xl font-bold mb-12 text-center opacity-0">
          Projets Web Design
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<p>Loading...</p>}>
            {projects.map((project, index) => (
              <div key={index} className="opacity-0">
                <DesignProjectCard {...project} />
              </div>
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default DesignProjects;