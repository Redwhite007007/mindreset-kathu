/**
 * Hand-maintained DB type shim. Regenerate with:
 *
 *     supabase gen types typescript --local > src/lib/supabase/types.ts
 *
 * once a Supabase project is linked. Until then this file is just enough
 * to type-check our community + cohort queries and the complete_quest RPC.
 */

export type UserRole = "youth" | "leader" | "admin";
export type ReactionType = "flame" | "pray" | "amen" | "same";

type Timestamp = string;
type Uuid = string;

export type Database = {
  public: {
    Tables: {
      cohorts: {
        Row: {
          id: Uuid;
          name: string;
          slug: string;
          invite_code: string;
          created_at: Timestamp;
        };
        Insert: {
          id?: Uuid;
          name: string;
          slug: string;
          invite_code?: string;
          created_at?: Timestamp;
        };
        Update: {
          id?: Uuid;
          name?: string;
          slug?: string;
          invite_code?: string;
          created_at?: Timestamp;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: Uuid;
          display_name: string;
          avatar_emoji: string;
          role: UserRole;
          cohort_id: Uuid | null;
          total_xp: number;
          current_streak: number;
          longest_streak: number;
          last_quest_completed_on: string | null;
          morning_push_enabled: boolean;
          evening_push_enabled: boolean;
          onboarding_complete_at: Timestamp | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id: Uuid;
          display_name: string;
          avatar_emoji?: string;
          role?: UserRole;
          cohort_id?: Uuid | null;
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_quest_completed_on?: string | null;
          morning_push_enabled?: boolean;
          evening_push_enabled?: boolean;
          onboarding_complete_at?: Timestamp | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: {
          display_name?: string;
          avatar_emoji?: string;
          role?: UserRole;
          cohort_id?: Uuid | null;
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_quest_completed_on?: string | null;
          morning_push_enabled?: boolean;
          evening_push_enabled?: boolean;
          onboarding_complete_at?: Timestamp | null;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      quest_completions: {
        Row: {
          id: Uuid;
          user_id: Uuid;
          week_number: number;
          day_number: number;
          completed_at: Timestamp;
          completed_on: string;
          duration_seconds: number | null;
          client_id: string | null;
        };
        Insert: {
          id?: Uuid;
          user_id: Uuid;
          week_number: number;
          day_number: number;
          completed_at?: Timestamp;
          completed_on?: string;
          duration_seconds?: number | null;
          client_id?: string | null;
        };
        Update: {
          duration_seconds?: number | null;
          client_id?: string | null;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: Uuid;
          user_id: Uuid;
          week_number: number | null;
          day_number: number | null;
          body: string;
          voice_note_path: string | null;
          voice_duration_s: number | null;
          photo_path: string | null;
          mood_emoji: string | null;
          client_id: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: Uuid;
          user_id: Uuid;
          week_number?: number | null;
          day_number?: number | null;
          body?: string;
          voice_note_path?: string | null;
          voice_duration_s?: number | null;
          photo_path?: string | null;
          mood_emoji?: string | null;
          client_id?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: {
          body?: string;
          voice_note_path?: string | null;
          voice_duration_s?: number | null;
          photo_path?: string | null;
          mood_emoji?: string | null;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          emoji: string;
          xp_reward: number;
          sort_order: number;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          emoji: string;
          xp_reward?: number;
          sort_order?: number;
        };
        Update: {
          name?: string;
          description?: string;
          emoji?: string;
          xp_reward?: number;
          sort_order?: number;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          user_id: Uuid;
          badge_id: string;
          earned_at: Timestamp;
        };
        Insert: {
          user_id: Uuid;
          badge_id: string;
          earned_at?: Timestamp;
        };
        Update: {
          earned_at?: Timestamp;
        };
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: Uuid;
          author_id: Uuid;
          cohort_id: Uuid;
          body: string;
          week_number: number | null;
          is_hidden: boolean;
          hidden_reason: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: Uuid;
          author_id: Uuid;
          cohort_id: Uuid;
          body: string;
          week_number?: number | null;
          is_hidden?: boolean;
          hidden_reason?: string | null;
          created_at?: Timestamp;
        };
        Update: {
          body?: string;
          week_number?: number | null;
          is_hidden?: boolean;
          hidden_reason?: string | null;
        };
        Relationships: [];
      };
      post_reactions: {
        Row: {
          user_id: Uuid;
          post_id: Uuid;
          reaction: ReactionType;
          created_at: Timestamp;
        };
        Insert: {
          user_id: Uuid;
          post_id: Uuid;
          reaction: ReactionType;
          created_at?: Timestamp;
        };
        Update: {
          created_at?: Timestamp;
        };
        Relationships: [];
      };
      post_reports: {
        Row: {
          id: Uuid;
          post_id: Uuid;
          reporter_id: Uuid;
          reason: string | null;
          resolved: boolean;
          resolved_by: Uuid | null;
          resolved_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: Uuid;
          post_id: Uuid;
          reporter_id: Uuid;
          reason?: string | null;
          resolved?: boolean;
          resolved_by?: Uuid | null;
          resolved_at?: Timestamp | null;
          created_at?: Timestamp;
        };
        Update: {
          reason?: string | null;
          resolved?: boolean;
          resolved_by?: Uuid | null;
          resolved_at?: Timestamp | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: Uuid;
          user_id: Uuid;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: Uuid;
          user_id: Uuid;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent?: string | null;
          created_at?: Timestamp;
        };
        Update: {
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_quest: {
        Args: {
          p_week: number;
          p_day: number;
          p_duration: number | null;
          p_client_id: string | null;
        };
        Returns: {
          xp_awarded: number;
          current_streak: number;
          new_badges: string[];
          replay: boolean;
        };
      };
      is_leader_of: {
        Args: { cohort: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      reaction_type: ReactionType;
    };
    CompositeTypes: Record<string, never>;
  };
};
