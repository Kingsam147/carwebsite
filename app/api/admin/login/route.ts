import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { adminLoginSchema } from '@/lib/validations'
import { checkRateLimit } from '@/lib/rateLimiter'

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'auth',
    maxRequests: 5,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = adminLoginSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (data.user.email !== process.env.ADMIN_EMAIL) {
    await supabase.auth.signOut()
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  return NextResponse.json({ success: true })
}
