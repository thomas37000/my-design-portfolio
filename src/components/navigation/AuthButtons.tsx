import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthButtonsProps {
  onAction?: () => void;
  className?: string;
}

const AuthButtons = ({ onAction, className = "" }: AuthButtonsProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    onAction?.();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onAction?.();
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleNavigate("/auth")}
        className={className}
      >
        Connexion
      </Button>
    );
  }

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {isAdmin && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigate("/admin")}
          className={className}
        >
          <Settings className="h-4 w-4 mr-1" />
          Admin
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className={className}
      >
        <LogOut className="h-4 w-4 mr-1" />
        Déconnexion
      </Button>
    </div>
  );
};

export default AuthButtons;
