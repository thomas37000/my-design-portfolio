import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import CVDownload from "./CVDownload";
import { useContentSettings } from "@/hooks/useContentSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { content, loading } = useContentSettings();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRan = useRef(false);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (loading || animationRan.current) return;

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
    }, sectionRef);

    animationRan.current = true;

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 bg-muted/50 rounded animate-pulse mb-8 mx-auto w-64" />
            <div className="space-y-4">
              <div className="h-24 bg-muted/50 rounded animate-pulse" />
              <div className="h-24 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="about-content"
            className="group w-full flex items-center justify-center gap-3 mb-8 opacity-0"
            ref={titleRef as unknown as React.RefObject<HTMLButtonElement>}
          >
            <h2 className="text-4xl font-bold text-center">
              {content.about.title}
            </h2>
            <span
              className={cn(
                "inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
                isOpen ? "rotate-180" : "rotate-0"
              )}
              aria-hidden="true"
            >
              <ChevronDown className="w-5 h-5" />
            </span>
          </button>

          <div
            id="about-content"
            ref={contentRef}
            className={cn(
              "grid transition-all duration-500 ease-in-out",
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-6 text-lg text-muted-foreground">
                {content.about.paragraphs.map((paragraph, index) => (
                  <div
                    key={index}
                    className="prose prose-lg dark:prose-invert max-w-none
                      prose-p:text-muted-foreground prose-strong:text-foreground
                      prose-ul:list-disc prose-ol:list-decimal
                      prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>
              <CVDownload />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
