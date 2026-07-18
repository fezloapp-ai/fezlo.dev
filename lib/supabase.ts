import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ziqilbzcdhoymtreyhxu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcWlsYnpjZGhveW10cmV5aHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNDY0MzksImV4cCI6MjA5OTcyMjQzOX0.6AcVvuFsluA64JMZqrzcYWZ9PhXDGWFtMWUwX85JCA8'

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return supabase
}
