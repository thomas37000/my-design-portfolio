import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import DesignProjects from "@/components/DesignProjects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { useProjectOrder } from "@/hooks/useProjectOrder";

const Index = () => {
  const { projectOrder } = useProjectOrder();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      {projectOrder === "dev-first" ? (
        <>
          <Projects />
          <DesignProjects />
        </>
      ) : (
        <>
          <DesignProjects />
          <Projects />
        </>
      )}
      <Skills />
      <Contact />
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>© 2026 Portfolio réalisé par Thomas Chalanson. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Index;
