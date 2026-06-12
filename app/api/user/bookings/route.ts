import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimiter'
import { createSupabaseServerClient } from '@/lib/supabase'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'read',
    maxRequests: 100,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { slot: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(bookings, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
