import { ThemeToggle } from "@/components/ThemeToggle";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  isOpen: boolean;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onNavigate, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 flex flex-col gap-4 animate-fade-in">
      <NavLinks
        onNavigate={onNavigate}
        className="flex flex-col gap-4"
        itemClassName="text-left"
        isMobile
      />
      
      <div className="pt-2 border-t border-border">
        <ThemeToggle />
      </div>
      
      <AuthButtons onAction={onClose} className="justify-start" />
    </div>
  );
};

export default MobileMenu;
