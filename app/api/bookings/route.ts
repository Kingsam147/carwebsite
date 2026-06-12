import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimiter'
import { bookingCreateSchema } from '@/lib/validations'
import { createBooking, SlotNotFoundError, SlotAlreadyBookedError } from '@/services/bookingService'

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'write',
    maxRequests: 30,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = bookingCreateSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  try {
    const booking = await createBooking(result.data)
    return NextResponse.json(booking, {
      status: 201,
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    if (error instanceof SlotNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof SlotAlreadyBookedError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    throw error
  }
}
