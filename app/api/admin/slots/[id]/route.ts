import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const slotId = parseInt(id, 10)

  if (isNaN(slotId)) {
    return NextResponse.json({ error: 'Invalid slot ID' }, { status: 400 })
  }

  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } })

  if (!slot) {
    return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
  }

  if (slot.isBooked) {
    await prisma.booking.delete({ where: { slotId } })
  }

  await prisma.timeSlot.delete({ where: { id: slotId } })

  return NextResponse.json({ success: true })
}
