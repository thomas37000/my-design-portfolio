import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimationConfig {
  ref: RefObject<HTMLElement | null>;
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  triggerRef?: RefObject<HTMLElement | null>;
  start?: string;
}

export const useScrollAnimation = (
  containerRef: RefObject<HTMLElement | null>,
  animations: AnimationConfig[]
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      animations.forEach(({ ref, from, to, triggerRef, start = "top 85%" }) => {
        if (!ref.current) return;

        gsap.fromTo(ref.current, from, {
          ...to,
          scrollTrigger: {
            trigger: triggerRef?.current || ref.current,
            start,
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, animations]);
};
