import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ProjectCardProps {
  description: string;
  technos?: string[];
  titre: string;
  lien_url: string;
  github: string;
  img: string;

  organisme: string;
}

const ProjectCard = ({ description, technos, titre, lien_url, github, img, organisme}: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={img}
          alt={titre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{titre}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <p className="flex justify-end mb-4">{organisme}</p>
        <div className="mb-4 flex justify-center gap-4">
          {lien_url !== null ? <Button
            onClick={() => window.open(`${lien_url}`, "_blank")}
            size="lg"
            className="group"
          >
            Démo Link
          </Button> : null}
          <Button
            onClick={() => window.open(`${github}`, "_blank")}
            size="lg"
            className="group"
            variant="outline"
          >
            Github
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technos?.map((techno, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              {techno}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
