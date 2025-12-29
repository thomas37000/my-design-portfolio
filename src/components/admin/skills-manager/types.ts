export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  created_at: string;
}

export interface SkillFormData {
  name: string;
  category: string;
  icon: string;
}

export const initialSkillFormData: SkillFormData = {
  name: "",
  category: "",
  icon: "",
};

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Base de données",
  "Outils",
  "Design",
  "DevOps",
  "Autres",
];

export const groupSkillsByCategory = (skills: Skill[]): Record<string, Skill[]> =>
  skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
