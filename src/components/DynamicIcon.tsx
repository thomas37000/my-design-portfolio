import { icons, HelpCircle, LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name?: string | null;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  if (!name) return <HelpCircle {...props} />;
  const Icon = (icons as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Icon) return <HelpCircle {...props} />;
  return <Icon {...props} />;
};

export default DynamicIcon;
