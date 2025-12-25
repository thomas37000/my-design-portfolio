import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 ref={titleRef} className="text-4xl font-bold mb-8 text-center opacity-0">
            À propos de moi
          </h2>
          <div ref={contentRef} className="space-y-6 text-lg text-muted-foreground">
            <p className="opacity-0">
              Bonjour ! Je suis un designer et développeur créatif avec une
              passion pour la création d'expériences digitales exceptionnelles.
              Mon approche combine esthétique moderne et fonctionnalité
              optimale.
            </p>
            <p className="opacity-0">
              Avec plusieurs années d'expérience dans le domaine du design
              digital, j'ai eu l'opportunité de travailler sur des projets
              variés, allant de sites web élégants à des applications mobiles
              innovantes.
            </p>
            <p className="opacity-0">
              Mon objectif est de transformer les idées en réalités visuelles
              qui captivent et engagent les utilisateurs tout en respectant les
              meilleures pratiques du design moderne.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
