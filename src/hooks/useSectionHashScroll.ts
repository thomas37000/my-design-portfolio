import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET = 88;
const MAX_ATTEMPTS = 80;
const POLL_INTERVAL = 50;
// Layout keeps shifting while images and animations settle, so the position
// is re-checked a few times after the first jump.
const CORRECTION_DELAYS = [300, 800];
const TOLERANCE = 80;

/**
 * Scrolls to the section matching the current URL hash once that section
 * exists in the DOM (sections can render after data loads).
 */
export function useSectionHashScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let disposed = false;
    let attempts = 0;
    let userScrolled = false;

    const markUserScroll = () => {
      userScrolled = true;
    };
    const events: (keyof WindowEventMap)[] = ["wheel", "touchstart", "keydown"];
    events.forEach((event) => window.addEventListener(event, markUserScroll, { passive: true }));

    const scrollToSection = () => {
      if (disposed) return;
      const element = document.getElementById(id);
      if (!element) {
        if (attempts++ < MAX_ATTEMPTS) {
          timers.push(setTimeout(scrollToSection, POLL_INTERVAL));
        }
        return;
      }

      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior: "instant" as ScrollBehavior });
    };

    const correctPosition = () => {
      if (disposed) return;
      const element = document.getElementById(id);
      if (!element) return;
      const offset = element.getBoundingClientRect().top - HEADER_OFFSET;
      if (Math.abs(offset) > TOLERANCE) {
        window.scrollTo({
          top: Math.max(window.scrollY + offset, 0),
          behavior: "instant" as ScrollBehavior,
        });
      }
    };

    scrollToSection();
    CORRECTION_DELAYS.forEach((delay) =>
      timers.push(setTimeout(correctPosition, delay))
    );

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
    };
  }, [hash, pathname]);
}

export default useSectionHashScroll;
