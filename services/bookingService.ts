import prisma from '@/lib/db'

export class SlotNotFoundError extends Error {
  constructor() {
    super('Time slot not found')
  }
}

export class SlotAlreadyBookedError extends Error {
  constructor() {
    super('Time slot is already booked')
  }
}

type BookingInput = {
  name: string
  phone: string
  vehicleType: string
  service: string
  addOns: string
  message: string
  slotId: number
}

export async function createBooking(input: BookingInput) {
  const slot = await prisma.timeSlot.findUnique({ where: { id: input.slotId } })

  if (!slot) throw new SlotNotFoundError()
  if (slot.isBooked) throw new SlotAlreadyBookedError()

  const booking = await prisma.booking.create({ data: input })

  await prisma.timeSlot.update({
    where: { id: input.slotId },
    data: { isBooked: true },
  })

  return booking
}
