import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useScrolled } from "@/hooks/useScrolled";
import NavLinks from "./navigation/NavLinks";
import AuthButtons from "./navigation/AuthButtons";
import MobileMenu from "./navigation/MobileMenu";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrolled(50);
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith("/projet/");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/">
              <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          </Link>

          {/* Desktop Navigation */}
          {!isProjectPage && (
            <div className="hidden md:flex gap-8 items-center">
              <NavLinks onNavigate={scrollToSection} className="flex gap-8" />
            </div>
          )}

          <div className="hidden md:flex items-center">
            <ThemeToggle />
            <AuthButtons />
          </div>
          
          {/* Mobile Menu Button */}
          {!isProjectPage && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          )}

          {isProjectPage && (
            <div className="md:hidden">
              <ThemeToggle />
              <AuthButtons />
            </div>
          )}
        </div>

        {!isProjectPage && (
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onNavigate={scrollToSection}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
