// 1. Create One Shared Supabase Client
var voltSupabase = null;
var supabaseConfig = window.VOLT_SUPABASE_CONFIG;

if (window.supabase && supabaseConfig && supabaseConfig.url && supabaseConfig.publishableKey) {
  voltSupabase = window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

window.voltSupabase = voltSupabase;
