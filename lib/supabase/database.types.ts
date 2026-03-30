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
      desk_brief: {
        Row: {
          badge: string
          body: string
          id: string
          label: string
          sort_order: number | null
          visible: boolean
        }
        Insert: {
          badge: string
          body: string
          id?: string
          label: string
          sort_order?: number | null
          visible?: boolean
        }
        Update: {
          badge?: string
          body?: string
          id?: string
          label?: string
          sort_order?: number | null
          visible?: boolean
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
      pipeline: {
        Row: {
          category: string[]
          codename: string
          format: string | null
          hook: string | null
          id: string
          last_updated: string | null
          redacted: boolean
          sort_order: number | null
          status: string | null
          status_type: string | null
          subtitle: string | null
          visible: boolean
        }
        Insert: {
          category?: string[]
          codename: string
          format?: string | null
          hook?: string | null
          id?: string
          last_updated?: string | null
          redacted?: boolean
          sort_order?: number | null
          status?: string | null
          status_type?: string | null
          subtitle?: string | null
          visible?: boolean
        }
        Update: {
          category?: string[]
          codename?: string
          format?: string | null
          hook?: string | null
          id?: string
          last_updated?: string | null
          redacted?: boolean
          sort_order?: number | null
          status?: string | null
          status_type?: string | null
          subtitle?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: string
          body_mdx: string
          created_at: string
          featured: boolean
          homepage: boolean
          id: number
          linked_model_id: number | null
          published_at: string | null
          scenarios_count: number | null
          slug: string
          sources_count: number | null
          stance_id: number | null
          status: string
          summary: string
          title: string
          topic_id: number | null
          updated_at: string
        }
        Insert: {
          body?: string
          body_mdx?: string
          created_at?: string
          featured?: boolean
          homepage?: boolean
          id?: number
          linked_model_id?: number | null
          published_at?: string | null
          scenarios_count?: number | null
          slug: string
          sources_count?: number | null
          stance_id?: number | null
          status?: string
          summary?: string
          title: string
          topic_id?: number | null
          updated_at?: string
        }
        Update: {
          body?: string
          body_mdx?: string
          created_at?: string
          featured?: boolean
          homepage?: boolean
          id?: number
          linked_model_id?: number | null
          published_at?: string | null
          scenarios_count?: number | null
          slug?: string
          sources_count?: number | null
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
