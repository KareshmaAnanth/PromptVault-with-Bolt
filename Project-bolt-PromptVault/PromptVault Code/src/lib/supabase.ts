import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          color?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          collection_id: string | null
          title: string
          content: string
          output: string
          tags: string[]
          is_favorite: boolean
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          collection_id?: string | null
          title: string
          content: string
          output?: string
          tags?: string[]
          is_favorite?: boolean
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          collection_id?: string | null
          title?: string
          content?: string
          output?: string
          tags?: string[]
          is_favorite?: boolean
          is_template?: boolean
          updated_at?: string
        }
      }
    }
  }
}