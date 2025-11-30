import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center hero-gradient pt-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Créateur Digital
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Designer & Développeur passionné par la création d'expériences
            digitales uniques et innovantes
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="group"
            >
              Voir mes projets
              <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Me contacter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
