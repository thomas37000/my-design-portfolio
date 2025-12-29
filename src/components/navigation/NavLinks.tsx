interface NavLink {
  id: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "projects", label: "Projets" },
  { id: "skills", label: "Compétences" },
  { id: "contact", label: "Contact" },
];

interface NavLinksProps {
  onNavigate: (id: string) => void;
  className?: string;
  itemClassName?: string;
}

const NavLinks = ({ onNavigate, className = "", itemClassName = "" }: NavLinksProps) => {
  const baseItemClass = "text-foreground hover:text-primary transition-colors";

  return (
    <div className={className}>
      {navLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => onNavigate(link.id)}
          className={`${baseItemClass} ${itemClassName}`}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
};

export default NavLinks;
