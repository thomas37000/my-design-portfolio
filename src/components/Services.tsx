import { Card } from "./ui/card";
import { Globe, Wrench, Palette, Sticker, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  price: string;
  description: string;
  features: string[];
  technos?: string[];
}

const services: Service[] = [
  {
    icon: Globe,
    title: "Création de site internet",
    price: "À partir de 800€",
    description: "Sites vitrines, portfolios ou applications web sur mesure, responsive et optimisés SEO.",
    features: [
      "Design sur mesure & responsive",
      "Optimisation SEO & performance",
      "Hébergement & nom de domaine",
      "Formation à l'utilisation",
    ],
    technos: ["React", "TypeScript", "Tailwind", "Supabase"],
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    price: "À partir de 50€/mois",
    description: "Mises à jour, sauvegardes, corrections de bugs et évolutions de votre site.",
    features: [
      "Mises à jour régulières",
      "Sauvegardes automatiques",
      "Corrections & évolutions",
      "Support réactif par email",
    ],
  },
  {
    icon: Palette,
    title: "Création de logo",
    price: "À partir de 250€",
    description: "Identité visuelle unique reflétant les valeurs de votre marque, déclinable sur tous supports.",
    features: [
      "Recherches & propositions",
      "Déclinaisons (couleurs, N&B)",
      "Fichiers vectoriels (SVG, AI)",
      "Charte graphique simple",
    ],
    technos: ["Illustrator", "Photoshop", "Figma"],
  },
  {
    icon: Sticker,
    title: "Design print & stickers",
    price: "Sur devis",
    description: "Macarons, stickers, flyers, cartes de visite — design prêt à imprimer pour tous vos supports.",
    features: [
      "Maquettes haute résolution",
      "Préparation pour impression",
      "Formats variés (A6, A5, custom)",
      "Conseils d'impression",
    ],
    technos: ["Illustrator", "InDesign"],
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Mes Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des prestations sur mesure pour donner vie à vos projets digitaux et visuels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="service-card p-6 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
                <p className="text-primary font-semibold mb-3">{service.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                <ul className="space-y-2 mb-4 flex-1">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {service.technos && service.technos.length > 0 && (
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
