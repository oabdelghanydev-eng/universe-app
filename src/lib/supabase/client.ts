/**
 * Supabase Client Configuration
 * Client-side Supabase client for read-only operations
 * 
 * Note: For uploads/deletes, use Server Actions which use the admin client
 */

import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key)
// Limited to read operations due to RLS + Firebase Auth
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const STORAGE_BUCKET = 'listings';
