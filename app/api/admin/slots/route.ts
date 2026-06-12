import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimiter'
import { slotCreateSchema } from '@/lib/validations'
import { getAllSlots, createSlot } from '@/services/slotService'

export async function GET(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'admin',
    maxRequests: 20,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slots = await getAllSlots()
  return NextResponse.json(slots, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'admin',
    maxRequests: 20,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = slotCreateSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const slot = await createSlot(result.data.date, result.data.time)
  return NextResponse.json(slot, {
    status: 201,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
