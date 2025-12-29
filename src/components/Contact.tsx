import { useRef, useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ContactInfo from "./contact/ContactInfo";
import ContactForm from "./contact/ContactForm";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const animations = useMemo(
    () => [
      {
        ref: titleRef,
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        triggerRef: sectionRef,
        start: "top 80%",
      },
      {
        ref: infoRef,
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      },
      {
        ref: formRef,
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      },
    ],
    []
  );

  useScrollAnimation(sectionRef, animations);

  return (
    <section ref={sectionRef} id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-4xl font-bold mb-12 text-center opacity-0"
        >
          Me Contacter
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <ContactInfo ref={infoRef} />
          <ContactForm ref={formRef} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
