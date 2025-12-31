import { ReactNode, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ProjectsGridProps {
  children: ReactNode[];
  title: string;
  className?: string;
  id?: string;
}

const ProjectsGrid = ({ children, title, className = "", id }: ProjectsGridProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useScrollAnimation(sectionRef, [
    {
      ref: titleRef,
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      triggerRef: sectionRef,
      start: "top 80%",
    },
  ]);

  return (
    <section ref={sectionRef} id={id} className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-4xl font-bold text-center mb-12 opacity-0">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children.map((child, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
