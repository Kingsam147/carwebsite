import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimiter'
import { getSlotsByDate, getAllSlots } from '@/services/slotService'

export async function GET(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'read',
    maxRequests: 100,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  const date = request.nextUrl.searchParams.get('date')
  const slots = date ? await getSlotsByDate(date) : await getAllSlots()

  return NextResponse.json(slots, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      'CDN-Cache-Control': 'max-age=300',
    },
  })
}
