export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alcools: {
        Row: {
          created_at: string
          id: number
          libelle: string | null
          nom: string | null
          quantite: number | null
          ticket_id: number | null
          total: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          libelle?: string | null
          nom?: string | null
          quantite?: number | null
          ticket_id?: number | null
          total?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          libelle?: string | null
          nom?: string | null
          quantite?: number | null
          ticket_id?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alcools_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "ticket_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      boucherie_traiteur: {
        Row: {
          created_at: string
          id: number
          libelle: string | null
          nom: string | null
          quantite: number | null
          ticket_id: number | null
          total: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          libelle?: string | null
          nom?: string | null
          quantite?: number | null
          ticket_id?: number | null
          total?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          libelle?: string | null
          nom?: string | null
          quantite?: number | null
          ticket_id?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "boucherie_traiteur_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "ticket_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      contact: {
        Row: {
          created_at: string
          email: string
          id: number
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      cv_data: {
        Row: {
          created_at: string
          cv_file_url: string | null
          education: Json
          email: string
          experiences: Json
          full_name: string
          id: string
          languages: Json
          location: string | null
          phone: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cv_file_url?: string | null
          education?: Json
          email?: string
          experiences?: Json
          full_name?: string
          id?: string
          languages?: Json
          location?: string | null
          phone?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cv_file_url?: string | null
          education?: Json
          email?: string
          experiences?: Json
          full_name?: string
          id?: string
          languages?: Json
          location?: string | null
          phone?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dépenses_année: {
        Row: {
          année: number | null
          created_at: string
          id: number
          total: number | null
        }
        Insert: {
          année?: number | null
          created_at?: string
          id?: number
          total?: number | null
        }
        Update: {
          année?: number | null
          created_at?: string
          id?: number
          total?: number | null
        }
        Relationships: []
      }
      dépenses_mois: {
        Row: {
          année: number | null
          created_at: string
          id: number
          mois: string | null
          semaine_moyenne: number | null
          total: number | null
        }
        Insert: {
          année?: number | null
          created_at?: string
          id?: number
          mois?: string | null
          semaine_moyenne?: number | null
          total?: number | null
        }
        Update: {
          année?: number | null
          created_at?: string
          id?: number
          mois?: string | null
          semaine_moyenne?: number | null
          total?: number | null
        }
        Relationships: []
      }
      designer_project_skills: {
        Row: {
          created_at: string
          id: string
          project_id: number
          skill_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: number
          skill_id: number
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "designer_project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_projects: {
        Row: {
          created_at: string
          description: string | null
          fini: boolean | null
          IA: boolean | null
          id: number
          images: string[] | null
          img: string | null
          lien_url: string | null
          logiciels: string[] | null
          nom_projet: string | null
          organisme: string | null
          tags: string[] | null
          titre: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          fini?: boolean | null
          IA?: boolean | null
          id?: number
          images?: string[] | null
          img?: string | null
          lien_url?: string | null
          logiciels?: string[] | null
          nom_projet?: string | null
          organisme?: string | null
          tags?: string[] | null
          titre?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          fini?: boolean | null
          IA?: boolean | null
          id?: number
          images?: string[] | null
          img?: string | null
          lien_url?: string | null
          logiciels?: string[] | null
          nom_projet?: string | null
          organisme?: string | null
          tags?: string[] | null
          titre?: string | null
        }
        Relationships: []
      }
      dev_project_skills: {
        Row: {
          created_at: string
          id: string
          project_id: number
          skill_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: number
          skill_id: number
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "dev_project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "dev_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dev_project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_projects: {
        Row: {
          created_at: string
          description: string | null
          fini: boolean | null
          github: string | null
          IA: boolean | null
          id: number
          img: string | null
          lien_url: string | null
          nom_projet: string | null
          organisme: string | null
          technos: string[] | null
          titre: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          fini?: boolean | null
          github?: string | null
          IA?: boolean | null
          id?: number
          img?: string | null
          lien_url?: string | null
          nom_projet?: string | null
          organisme?: string | null
          technos?: string[] | null
          titre?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          fini?: boolean | null
          github?: string | null
          IA?: boolean | null
          id?: number
          img?: string | null
          lien_url?: string | null
          nom_projet?: string | null
          organisme?: string | null
          technos?: string[] | null
          titre?: string | null
        }
        Relationships: []
      }
      epicerie_boissons: {
        Row: {
          created_at: string
          id: number
          nom: string | null
          quantite: number | null
          ticket_id: number | null
          total: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          nom?: string | null
          quantite?: number | null
          ticket_id?: number | null
          total?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          nom?: string | null
          quantite?: number | null
          ticket_id?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "epicerie_boissons_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "ticket_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      fruits_legumes: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      hygiene_sante: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      liste_courses: {
        Row: {
          adresse: string | null
          created_at: string
          departement: string | null
          id: number
          magasin: number | null
          nom_magasin: string | null
          nombre_articles: number | null
          total: number | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          departement?: string | null
          id?: number
          magasin?: number | null
          nom_magasin?: string | null
          nombre_articles?: number | null
          total?: number | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string
          departement?: string | null
          id?: number
          magasin?: number | null
          nom_magasin?: string | null
          nombre_articles?: number | null
          total?: number | null
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liste_courses_magasin_fkey"
            columns: ["magasin"]
            isOneToOne: false
            referencedRelation: "magasin"
            referencedColumns: ["id"]
          },
        ]
      }
      logements: {
        Row: {
          chambre: number | null
          charges: number | null
          created_at: string
          description: string | null
          id: number
          image: string | null
          images: string[] | null
          "nb-pieces": number | null
          nom: string | null
          prix: number | null
          surface: number | null
          "surface-jardin": number | null
        }
        Insert: {
          chambre?: number | null
          charges?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          images?: string[] | null
          "nb-pieces"?: number | null
          nom?: string | null
          prix?: number | null
          surface?: number | null
          "surface-jardin"?: number | null
        }
        Update: {
          chambre?: number | null
          charges?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          images?: string[] | null
          "nb-pieces"?: number | null
          nom?: string | null
          prix?: number | null
          surface?: number | null
          "surface-jardin"?: number | null
        }
        Relationships: []
      }
      magasin: {
        Row: {
          adresse: string | null
          created_at: string
          departement: string | null
          id: number
          latitude: number | null
          longitude: number | null
          nom_magasin: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          departement?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          nom_magasin?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string
          departement?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          nom_magasin?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      patisserie_viennoiserie: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      surgeles_produits_frais: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      ticket_detail: {
        Row: {
          created_at: string
          id: number
          nom_magasin: number | null
          total: number
        }
        Insert: {
          created_at?: string
          id?: number
          nom_magasin?: number | null
          total: number
        }
        Update: {
          created_at?: string
          id?: number
          nom_magasin?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_detail_nom_magasin_fkey"
            columns: ["nom_magasin"]
            isOneToOne: false
            referencedRelation: "magasin"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: number
          nom: string | null
          prénom: string | null
          roles: string
        }
        Insert: {
          created_at?: string
          id?: number
          nom?: string | null
          prénom?: string | null
          roles?: string
        }
        Update: {
          created_at?: string
          id?: number
          nom?: string | null
          prénom?: string | null
          roles?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_ip_address: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: {
          allowed: boolean
          remaining: number
          reset_at: string
        }[]
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      get_complete_schema: { Args: never; Returns: Json }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
