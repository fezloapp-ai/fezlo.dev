import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get('key')
  if (!apiKey) {
    return NextResponse.json({ error: 'missing_key' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('api_clients')
    .select('company_name, monthly_quota, calls_used')
    .eq('api_key', apiKey)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: 'invalid_key' }, { status: 404 })
  }
  return NextResponse.json(data)
}
