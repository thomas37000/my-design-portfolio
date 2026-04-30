import { Card } from "./ui/card";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useServices } from "@/hooks/useServices";
import DynamicIcon from "./DynamicIcon";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { services, loading } = useServices();

  useEffect(() => {
    if (loading || services.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, services.length]);

  if (loading || services.length === 0) {
    return (
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Mes Services</h2>
          {loading && <p className="text-muted-foreground">Chargement...</p>}
        </div>
      </section>
    );
  }

  const gridCols =
    services.length >= 4
      ? "lg:grid-cols-4"
      : services.length === 3
      ? "lg:grid-cols-3"
      : services.length === 2
      ? "lg:grid-cols-2"
      : "lg:grid-cols-1";

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Mes Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des prestations sur mesure pour donner vie à vos projets digitaux et visuels.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
          {services.map((service) => (
            <Card
              key={service.id}
              className="service-card p-6 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <DynamicIcon name={service.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
              {service.price && (
                <p className="text-primary font-semibold mb-3">{service.price}</p>
              )}
              {service.description && (
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              )}

              {service.features.length > 0 && (
                <ul className="space-y-2 mb-4 flex-1">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {service.technos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  {service.technos.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
