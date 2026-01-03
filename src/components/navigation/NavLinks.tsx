import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  id: string;
  label: string;
  submenu?: { id: string; label: string }[];
}

export const navLinks: NavLink[] = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { 
    id: "projects", 
    label: "Projets",
    submenu: [
      { id: "projects", label: "Projets Dev" },
      { id: "design-projects", label: "Projets Web Design" },
    ]
  },
  { id: "skills", label: "Compétences" },
  { id: "contact", label: "Contact" },
];

interface NavLinksProps {
  onNavigate: (id: string) => void;
  className?: string;
  itemClassName?: string;
  isMobile?: boolean;
}

const NavLinks = ({ onNavigate, className = "", itemClassName = "", isMobile = false }: NavLinksProps) => {
  const baseItemClass = "text-foreground hover:text-primary transition-colors";

  return (
    <div className={className}>
      {navLinks.map((link) => (
        link.submenu ? (
          isMobile ? (
            <div key={link.id} className="flex flex-col gap-2">
              <span className={`${baseItemClass} ${itemClassName} font-medium`}>{link.label}</span>
              <div className="flex flex-col gap-2 pl-4">
                {link.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate(subItem.id)}
                    className={`${baseItemClass} ${itemClassName} text-sm`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <DropdownMenu key={link.id}>
              <DropdownMenuTrigger className={`${baseItemClass} ${itemClassName} flex items-center gap-1 outline-none`}>
                {link.label}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border z-50">
                {link.submenu.map((subItem) => (
                  <DropdownMenuItem
                    key={subItem.id}
                    onClick={() => onNavigate(subItem.id)}
                    className="cursor-pointer"
                  >
                    {subItem.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className={`${baseItemClass} ${itemClassName}`}
          >
            {link.label}
          </button>
        )
      ))}
    </div>
  );
};

export default NavLinks;
