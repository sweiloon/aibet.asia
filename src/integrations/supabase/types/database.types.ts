
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
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          admin_created: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          admin_created: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          admin_created?: boolean
          updated_at?: string
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
