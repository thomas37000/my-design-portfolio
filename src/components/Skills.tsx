import { useEffect, useState, useRef } from "react";
import { Badge } from "./ui/badge";
import { Code, Palette, Database, Wrench, Layers, Server, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Frontend": <Code className="w-6 h-6" />,
  "Backend": <Server className="w-6 h-6" />,
  "Base de données": <Database className="w-6 h-6" />,
  "Outils": <Wrench className="w-6 h-6" />,
  "Design": <Palette className="w-6 h-6" />,
  "DevOps": <Layers className="w-6 h-6" />,
  "Autres": <MoreHorizontal className="w-6 h-6" />,
};

const Skills = () => {
  const [groupedSkills, setGroupedSkills] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true });

      if (!error && data) {
        const grouped = data.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {} as Record<string, Skill[]>);
        setGroupedSkills(grouped);
      }
      setLoading(false);
    };

    fetchSkills();
  }, []);

  const categories = Object.keys(groupedSkills);

  useEffect(() => {
    if (loading || categories.length === 0) return;

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
  }, [loading, categories]);

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Compétences</h2>
          <div className="text-center text-muted-foreground">Chargement...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section id="skills" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Compétences</h2>
          <div className="text-center text-muted-foreground">Aucune compétence disponible</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-4xl font-bold mb-12 text-center opacity-0">
          Compétences
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category}
              className="p-6 rounded-lg bg-card hover:shadow-lg transition-shadow opacity-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                  {categoryIcons[category] || <MoreHorizontal className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {groupedSkills[category].map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
