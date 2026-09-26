import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET = 88;
const MAX_ATTEMPTS = 80;
const POLL_INTERVAL = 50;

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

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const scrollToSection = () => {
      const element = document.getElementById(id);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
        return;
      }
      if (attempts++ < MAX_ATTEMPTS) {
        timer = setTimeout(scrollToSection, POLL_INTERVAL);
      }
    };

    scrollToSection();

    return () => clearTimeout(timer);
  }, [hash, pathname]);
}

export default useSectionHashScroll;
