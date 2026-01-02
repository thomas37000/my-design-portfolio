import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useContentSettings } from "@/hooks/useContentSettings";

const Hero = () => {
  const { content, loading } = useContentSettings();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const animationRan = useRef(false);

  useEffect(() => {
    if (loading || animationRan.current) return;
    
    const ctx = gsap.context(() => {
      // Animation du titre lettre par lettre
      if (titleRef.current) {
        const text = titleRef.current.innerText;
        titleRef.current.innerHTML = text
          .split("")
          .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
          .join("");

        gsap.fromTo(
          titleRef.current.querySelectorAll("span"),
          {
            opacity: 0,
            y: 50,
            rotateX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.7)",
          }
        );
      }

      // Animation du sous-titre
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.8,
          ease: "power3.out",
        }
      );

      // Animation des boutons
      gsap.fromTo(
        buttonsRef.current?.children || [],
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 1.2,
          ease: "power2.out",
        }
      );
    });
    
    animationRan.current = true;

    return () => ctx.revert();
  }, [loading, content.hero.title]);

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center hero-gradient pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-16 bg-muted/30 rounded animate-pulse mb-6" />
            <div className="h-8 bg-muted/30 rounded animate-pulse mb-8" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center hero-gradient pt-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
            style={{ perspective: "1000px" }}
          >
            {content.hero.title}
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl mb-8 text-muted-foreground opacity-0"
          >
            {content.hero.subtitle}
          </p>
          <div ref={buttonsRef} className="flex gap-4 justify-center">
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="group opacity-0"
            >
              {content.hero.buttonProjects}
              <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="opacity-0"
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {content.hero.buttonContact}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
