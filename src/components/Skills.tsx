import { Badge } from "./ui/badge";
import { Code, Palette, Smartphone, Layers } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design",
      skills: ["UI/UX Design", "Figma", "Adobe XD", "Illustration"],
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Développement",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile",
      skills: ["React Native", "Responsive Design", "PWA", "App Design"],
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Autres",
      skills: ["Git", "Design System", "Prototyping", "Animation"],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Compétences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="animate-fade-in p-6 rounded-lg bg-card hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary">
                    {skill}
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
