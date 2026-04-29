import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import DesignProjects from "@/components/DesignProjects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";
import { Linkedin, Github, Mail } from "lucide-react";
import { useProjectOrder } from "@/hooks/useProjectOrder";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const Index = () => {
  const { projectOrder } = useProjectOrder();
  const { links } = useSocialLinks();

  const socials = [
    { key: "linkedin", label: "LinkedIn", Icon: Linkedin, href: links.linkedin },
    { key: "github", label: "GitHub", Icon: Github, href: links.github },
    {
      key: "email",
      label: "Email",
      Icon: Mail,
      href: links.email ? `mailto:${links.email}` : "",
    },
  ];

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
      <footer className="py-8 border-t">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-4">
            {socials.map(({ key, label, Icon, href }) =>
              href ? (
                <a
                  key={key}
                  href={href}
                  target={key === "email" ? undefined : "_blank"}
                  rel={key === "email" ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  className="p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ) : null
            )}
          </div>
          <p className="text-center">© 2026 Portfolio réalisé par Thomas Chalanson. Tous droits réservés.</p>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
};

export default Index;
