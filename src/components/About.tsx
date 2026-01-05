import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CVDownload from "./CVDownload";
import { useContentSettings } from "@/hooks/useContentSettings";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { content, loading } = useContentSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRan = useRef(false);

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

  // Check if we have rich content, otherwise fall back to paragraphs
  const hasRichContent = content.about.richContent && content.about.richContent.trim() !== "";

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 ref={titleRef} className="text-4xl font-bold mb-8 text-center opacity-0">
            {content.about.title}
          </h2>
          <div ref={contentRef} className="space-y-6 text-lg text-muted-foreground">
            {hasRichContent ? (
              <div 
                className="prose prose-lg dark:prose-invert max-w-none opacity-0
                  prose-p:text-muted-foreground prose-strong:text-foreground
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: content.about.richContent! }}
              />
            ) : (
              content.about.paragraphs.map((paragraph, index) => (
                <p key={index} className="opacity-0">
                  {paragraph}
                </p>
              ))
            )}
          </div>
          <CVDownload />
        </div>
      </div>
    </section>
  );
};

export default About;
