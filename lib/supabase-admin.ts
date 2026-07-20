import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ziqilbzcdhoymtreyhxu.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceRoleKey)
