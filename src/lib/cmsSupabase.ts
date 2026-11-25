import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_CMS_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_CMS_SUPABASE_PUBLISHABLE_KEY;

// The CMS uses a separate Supabase project from Bolt's original intake database.
// Never put a service_role or secret key in these Vite variables.
export const cmsSupabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
