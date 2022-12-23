import { createClient } from "@supabase/supabase-js";
import { supabaseApiKey, supabaseUrl } from "./environent";

export const supabase = createClient(supabaseUrl, supabaseApiKey);
