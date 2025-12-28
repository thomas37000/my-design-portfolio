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
      <Projects />
      <DesignProjects />
      <Skills />
      <Contact />
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>© 2024 Portfolio. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Index;
