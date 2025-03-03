export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      favorite_tracks: {
        Row: {
          created_at: string
          id: number
          profile_id: string | null
          track_id: number[] | null
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id?: string | null
          track_id?: number[] | null
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string | null
          track_id?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "favorite_tracks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      groups_users: {
        Row: {
          created_at: string
          group_id: number
          id: number
          invited_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: number
          id?: number
          invited_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: number
          id?: number
          invited_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_groups_users_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      lap_times: {
        Row: {
          created_at: string
          id: number
          session_id: number | null
          time: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          session_id?: number | null
          time?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          session_id?: number | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_lap_times_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          rider_number: number | null
          theme: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          rider_number?: number | null
          theme?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          rider_number?: number | null
          theme?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          best_lap: number | null
          condition: Database["public"]["Enums"]["track_condtion"] | null
          created_at: string
          duration: string | null
          id: number
          note: string | null
          track_id: number | null
          user_id: string | null
        }
        Insert: {
          best_lap?: number | null
          condition?: Database["public"]["Enums"]["track_condtion"] | null
          created_at?: string
          duration?: string | null
          id?: number
          note?: string | null
          track_id?: number | null
          user_id?: string | null
        }
        Update: {
          best_lap?: number | null
          condition?: Database["public"]["Enums"]["track_condtion"] | null
          created_at?: string
          duration?: string | null
          id?: number
          note?: string | null
          track_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_sessions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_best_lap_fkey"
            columns: ["best_lap"]
            isOneToOne: false
            referencedRelation: "lap_times"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          coordinates: unknown | null
          created_at: string
          id: number
          location: string | null
          name: string | null
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string
          id?: number
          location?: string | null
          name?: string | null
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string
          id?: number
          location?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      closest_track: {
        Args: {
          lat: number
          long: number
        }
        Returns: {
          id: number
          name: string
          location: string
          lat: number
          long: number
          dist_meters: number
        }[]
      }
    }
    Enums: {
      track_condtion: "GOOD" | "MEDIUM" | "HEAVY"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
