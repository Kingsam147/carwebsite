import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')

  if (date) {
    const slots = await prisma.timeSlot.findMany({
      where: { date, isBooked: false },
      select: { id: true, time: true },
      orderBy: { time: 'asc' },
    })
    return NextResponse.json(slots)
  }

  const slots = await prisma.timeSlot.findMany({
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  return NextResponse.json(slots)
}
