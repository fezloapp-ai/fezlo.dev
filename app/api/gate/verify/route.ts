import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const apiKey = authHeader.replace('Bearer ', '').trim()
  if (!apiKey) {
    return NextResponse.json({ error: 'missing_api_key' }, { status: 401, headers: corsHeaders })
  }

  const { data: client, error: clientError } = await supabaseAdmin
    .from('api_clients')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  if (clientError || !client) {
    return NextResponse.json({ error: 'invalid_api_key' }, { status: 401, headers: corsHeaders })
  }

  if (client.calls_used >= client.monthly_quota) {
    return NextResponse.json({ error: 'quota_exceeded' }, { status: 429, headers: corsHeaders })
  }

  const body = await request.json().catch(() => ({}))
  const verificationId = body.verification_id

  if (!verificationId) {
    return NextResponse.json({ error: 'missing_verification_id' }, { status: 400, headers: corsHeaders })
  }

  const { data: verif } = await supabaseAdmin
    .from('verifications')
    .select('passed')
    .eq('id', verificationId)
    .single()

  await supabaseAdmin
    .from('api_clients')
    .update({ calls_used: client.calls_used + 1 })
    .eq('id', client.id)

  return NextResponse.json({ verified: verif?.passed === true }, { headers: corsHeaders })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
