import { Card } from "./ui/card";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const ProjectCard = ({ title, description, image, tags }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
