import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ExternalLink } from "lucide-react";

interface DesignProjectCardProps {
  description: string;
  logiciels?: string[];
  tags?: string[];
  titre: string;
  lien_url: string;
  img: string;
  organisme: string;
}

const DesignProjectCard = ({ 
  description, 
  logiciels, 
  tags, 
  titre, 
  lien_url, 
  img, 
  organisme 
}: DesignProjectCardProps) => {
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
        <p className="flex justify-end mb-4 text-sm text-muted-foreground">{organisme}</p>
        <div className="mb-4 flex justify-center">
          {lien_url && (
            <Button
              onClick={() => window.open(lien_url, "_blank")}
              size="lg"
              className="group"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir le projet
            </Button>
          )}
        </div>
        {logiciels && logiciels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {logiciels.map((logiciel, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {logiciel}
              </span>
            ))}
          </div>
        )}
        {tags && tags.length > 0 && (
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
        )}
      </div>
    </Card>
  );
};

export default DesignProjectCard;