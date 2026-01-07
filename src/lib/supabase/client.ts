import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

/**
 * Supabase Client for Healit Healthcare Platform
 * 
 * @description Configured with Row Level Security (RLS) for healthcare data protection
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-healit-client': 'web',
    },
  },
});

/**
 * Type-safe database helpers
 */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          full_name: string;
          phone: string | null;
          language: string;
          kupat_holim: string | null;
          license_number: string | null;
          clinic_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: string;
          full_name: string;
          phone?: string | null;
          language?: string;
          kupat_holim?: string | null;
          license_number?: string | null;
          clinic_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          role?: string;
          full_name?: string;
          phone?: string | null;
          language?: string;
          kupat_holim?: string | null;
          license_number?: string | null;
          clinic_id?: string | null;
          updated_at?: string;
        };
      };
      // More tables will be defined in migrations
    };
  };
};
