import { z } from "zod";

export interface Skill {
  id: number;
  name: string;
  category: string;
}

export interface ProjectFormData {
  titre: string;
  nom_projet: string;
  description: string;
  organisme: string;
  lien_url: string;
  img: string;
  images: string[];
  github: string;
  technos: string;
  logiciels: string;
  tags: string;
  fini: boolean;
  IA: boolean;
}

export const initialFormData: ProjectFormData = {
  titre: "",
  nom_projet: "",
  description: "",
  organisme: "",
  lien_url: "",
  img: "",
  images: [],
  github: "",
  technos: "",
  logiciels: "",
  tags: "",
  fini: false,
  IA: false,
};

export const projectSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis").max(200),
  nom_projet: z.string().trim().max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  organisme: z.string().trim().max(200).optional(),
  lien_url: z.string().trim().url("URL invalide").or(z.literal("")).optional(),
  img: z.string().trim().url("URL invalide").or(z.literal("")).optional(),
});

export const parseArrayField = (value: string): string[] =>
  value.split(",").map((t) => t.trim()).filter((t) => t);

export const groupSkillsByCategory = (skills: Skill[]): Record<string, Skill[]> =>
  skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
