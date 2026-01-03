import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroContent {
  title: string;
  subtitle: string;
  buttonProjects: string;
  buttonContact: string;
  image?: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

export interface ContentSettings {
  hero: HeroContent;
  about: AboutContent;
}

const defaultContent: ContentSettings = {
  hero: {
    title: "Créateur Digital",
    subtitle: "Designer & Développeur passionné par la création d'expériences digitales uniques et innovantes",
    buttonProjects: "Voir mes projets",
    buttonContact: "Me contacter",
  },
  about: {
    title: "À propos de moi",
    paragraphs: [
      "Bonjour ! Je suis un designer et développeur créatif avec une passion pour la création d'expériences digitales exceptionnelles. Mon approche combine esthétique moderne et fonctionnalité optimale.",
      "Avec plusieurs années d'expérience dans le domaine du design digital, j'ai eu l'opportunité de travailler sur des projets variés, allant de sites web élégants à des applications mobiles innovantes.",
      "Mon objectif est de transformer les idées en réalités visuelles qui captivent et engagent les utilisateurs tout en respectant les meilleures pratiques du design moderne.",
    ],
  },
};

export const useContentSettings = () => {
  const [content, setContent] = useState<ContentSettings>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "content_settings")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setContent(data.value as unknown as ContentSettings);
      }
    } catch (error) {
      console.error("Error fetching content settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: ContentSettings): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("settings")
        .upsert(
          [{ key: "content_settings", value: JSON.parse(JSON.stringify(newContent)), updated_at: new Date().toISOString() }],
          { onConflict: "key" }
        );

      if (error) throw error;

      setContent(newContent);
      return true;
    } catch (error) {
      console.error("Error updating content settings:", error);
      return false;
    }
  };

  return { content, loading, updateContent, refetch: fetchContent };
};
