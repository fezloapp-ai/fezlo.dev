import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('handle, badge_tier, verified_at, trust_score')
    .eq('badge_token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 404, headers: corsHeaders })
  }

  return NextResponse.json(
    {
      handle: data.handle,
      verified: data.badge_tier === 'verified',
      badge_tier: data.badge_tier,
      trust_score: data.trust_score,
    },
    { headers: corsHeaders }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
