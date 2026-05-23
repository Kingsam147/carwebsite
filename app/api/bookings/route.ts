import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, vehicleType, service, addOns, message, slotId } = body as Record<string, unknown>

  if (!name || !phone || !vehicleType || !service || !slotId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (typeof slotId !== 'number') {
    return NextResponse.json({ error: 'slotId must be a number' }, { status: 400 })
  }

  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } })

  if (!slot) {
    return NextResponse.json({ error: 'Time slot not found' }, { status: 404 })
  }

  if (slot.isBooked) {
    return NextResponse.json({ error: 'Time slot is already booked' }, { status: 409 })
  }

  const booking = await prisma.booking.create({
    data: {
      name: String(name),
      phone: String(phone),
      vehicleType: String(vehicleType),
      service: String(service),
      addOns: addOns ? String(addOns) : '',
      message: message ? String(message) : '',
      slotId,
    },
  })

  await prisma.timeSlot.update({
    where: { id: slotId },
    data: { isBooked: true },
  })

  return NextResponse.json(booking, { status: 201 })
}
