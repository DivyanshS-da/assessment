import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== '' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== ''
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
