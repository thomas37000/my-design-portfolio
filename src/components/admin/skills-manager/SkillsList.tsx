import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Skill, groupSkillsByCategory } from "./types";

interface SkillsListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
}

const SkillsList = ({ skills, onEdit, onDelete }: SkillsListProps) => {
  const groupedSkills = groupSkillsByCategory(skills);

  if (Object.keys(groupedSkills).length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Aucune compétence ajoutée
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-3">
          <h3 className="font-semibold text-lg">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-1 bg-secondary/50 rounded-full pl-3 pr-1 py-1"
              >
                <span className="text-sm">{skill.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEdit(skill)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => onDelete(skill.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
