import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import DesignProjects from "@/components/DesignProjects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <DesignProjects />
      <Projects />
      <Skills />
      <Contact />
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>© 2026 Portfolio réalisé par Thomas Chalanson. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Index;
