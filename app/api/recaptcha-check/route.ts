import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token } = await request.json().catch(() => ({}))
  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 400 })
  }
  const secret = process.env.RECAPTCHA_SECRET_KEY
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  })
  const data = await res.json()
  return NextResponse.json({ success: data.success, score: data.score ?? null })
}
