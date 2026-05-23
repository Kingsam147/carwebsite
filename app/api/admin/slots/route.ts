import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slots = await prisma.timeSlot.findMany({
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    include: { booking: true },
  })

  return NextResponse.json(slots)
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { date, time } = body as Record<string, unknown>

  if (!date || !time) {
    return NextResponse.json({ error: 'date and time are required' }, { status: 400 })
  }

  const slot = await prisma.timeSlot.create({
    data: { date: String(date), time: String(time) },
  })

  return NextResponse.json(slot, { status: 201 })
}
