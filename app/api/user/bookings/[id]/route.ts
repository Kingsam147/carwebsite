import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimiter'
import { createSupabaseServerClient } from '@/lib/supabase'
import { bookingUpdateSchema } from '@/lib/validations'
import prisma from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'write',
    maxRequests: 30,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const bookingId = parseInt(id, 10)
  if (isNaN(bookingId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const existing = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = bookingUpdateSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: result.data,
  })

  return NextResponse.json(updated, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, {
    prefix: 'write',
    maxRequests: 30,
    windowSeconds: 60,
  })
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const bookingId = parseInt(id, 10)
  if (isNaN(bookingId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.$transaction([
    prisma.booking.delete({ where: { id: bookingId } }),
    prisma.timeSlot.update({
      where: { id: existing.slotId },
      data: { isBooked: false },
    }),
  ])

  return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'private, no-store' } })
}
