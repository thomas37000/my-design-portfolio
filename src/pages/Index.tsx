import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import DesignProjects from "@/components/DesignProjects";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";
import DynamicIcon from "@/components/DynamicIcon";
import { useProjectOrder } from "@/hooks/useProjectOrder";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const Index = () => {
  const { projectOrder } = useProjectOrder();
  const { links } = useSocialLinks();

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
      <Services />
      <Contact />
      <footer className="py-8 border-t">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-4">
            {links
              .filter((l) => l.url)
              .map((link) => {
                const isMail = link.url.startsWith("mailto:");
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    aria-label={link.label || link.icon}
                    className="p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <DynamicIcon name={link.icon} className="w-5 h-5" />
                  </a>
                );
              })}
          </div>
          <p className="text-center">© 2026 Portfolio réalisé par Thomas Chalanson. Tous droits réservés.</p>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
};

export default Index;
