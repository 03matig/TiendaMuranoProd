import { createClient } from "@supabase/supabase-js";

export const getSupabase = () => {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
}

export default getSupabase;
