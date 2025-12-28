import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalGalleryProps {
  children: ReactNode[];
  title: string;
  className?: string;
  id?: string;
}

const HorizontalGallery = ({ children, title, className = "", id }: HorizontalGalleryProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!galleryRef.current || !triggerRef.current || children.length === 0) return;

    // Wait for layout to settle
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      // Title animation
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

      // Horizontal scroll animation
      const galleryWidth = galleryRef.current!.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = Math.max(0, galleryWidth - viewportWidth + 100);

      if (scrollDistance > 0) {
        gsap.to(galleryRef.current, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate each card on scroll
      const cards = galleryRef.current!.children;
      gsap.fromTo(
        cards,
        { opacity: 0.5, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, [children]);

  return (
    <section ref={sectionRef} id={id} className={`relative ${className}`}>
      <div className="py-20">
        <div className="container mx-auto px-4 mb-8">
          <h2 ref={titleRef} className="text-4xl font-bold text-center opacity-0">
            {title}
          </h2>
        </div>
        <div ref={triggerRef} className="overflow-hidden min-h-[50vh]">
          <div
            ref={galleryRef}
            className="flex gap-8 pl-4 md:pl-[10vw] pr-[10vw]"
            style={{ width: "max-content" }}
          >
            {children.map((child, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw]"
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalGallery;
