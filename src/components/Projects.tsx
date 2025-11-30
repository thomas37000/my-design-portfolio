import ProjectCard from "./ProjectCard";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";

const Projects = () => {
  const projects = [
    {
      title: "Site Web E-commerce",
      description:
        "Design moderne et épuré pour une plateforme e-commerce avec une expérience utilisateur optimisée.",
      image: project1,
      tags: ["UI/UX", "Web Design", "React"],
    },
    {
      title: "Application Mobile",
      description:
        "Interface intuitive pour une application mobile de commerce, alliant élégance et performance.",
      image: project2,
      tags: ["Mobile", "UI Design", "Prototype"],
    },
    {
      title: "Identité de Marque",
      description:
        "Création complète d'une identité visuelle incluant logo, palette de couleurs et guidelines.",
      image: project3,
      tags: ["Branding", "Design System", "Logo"],
    },
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Mes Projets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
