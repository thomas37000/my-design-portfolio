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
      designer_projects: {
        Row: {
          created_at: string
          description: string | null
          fini: boolean | null
          IA: boolean | null
          id: number
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
      get_complete_schema: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
