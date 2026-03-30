export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_bootstrap_invites: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      in_progress_items: {
        Row: {
          body: string
          created_at: string
          id: number
          priority: number
          slug: string
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: number
          priority?: number
          slug: string
          status?: string
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
          priority?: number
          slug?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string
          file_path: string
          id: number
          post_id: number | null
          title: string
          topic_id: number | null
          updated_at: string
          uploaded_at: string
          version: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: number
          post_id?: number | null
          title: string
          topic_id?: number | null
          updated_at?: string
          uploaded_at?: string
          version: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: number
          post_id?: number | null
          title?: string
          topic_id?: number | null
          updated_at?: string
          uploaded_at?: string
          version?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: string
          created_at: string
          featured: boolean
          homepage: boolean
          id: number
          linked_model_id: number | null
          published_at: string | null
          slug: string
          stance_id: number | null
          status: string
          summary: string
          title: string
          topic_id: number | null
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          featured?: boolean
          homepage?: boolean
          id?: number
          linked_model_id?: number | null
          published_at?: string | null
          slug: string
          stance_id?: number | null
          status?: string
          summary?: string
          title: string
          topic_id?: number | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          featured?: boolean
          homepage?: boolean
          id?: number
          linked_model_id?: number | null
          published_at?: string | null
          slug?: string
          stance_id?: number | null
          status?: string
          summary?: string
          title?: string
          topic_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          label: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          label: string
          updated_at?: string
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          label?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stances: {
        Row: {
          body: string
          created_at: string
          id: number
          published_at: string | null
          slug: string
          status: string
          summary: string
          title: string
          topic_id: number | null
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: number
          published_at?: string | null
          slug: string
          status?: string
          summary?: string
          title: string
          topic_id?: number | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
          published_at?: string | null
          slug?: string
          status?: string
          summary?: string
          title?: string
          topic_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_visible: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_visible?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_visible?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      claim_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
