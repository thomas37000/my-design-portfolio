import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skill, groupSkillsByCategory } from "./types";

interface SkillsSelectorProps {
  skills: Skill[];
  selectedSkillIds: number[];
  onToggleSkill: (skillId: number) => void;
}

const SkillsSelector = ({
  skills,
  selectedSkillIds,
  onToggleSkill,
}: SkillsSelectorProps) => {
  const groupedSkills = groupSkillsByCategory(skills);

  return (
    <div>
      <Label>Compétences associées</Label>
      <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-3 space-y-3">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <label
                  key={skill.id}
                  className="flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSkillIds.includes(skill.id)}
                    onCheckedChange={() => onToggleSkill(skill.id)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune compétence disponible
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillsSelector;
