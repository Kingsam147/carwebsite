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
  userId: string
  name: string
  phone: string
  vehicleType: string
  service: string
  addOns: string
  message: string
  date: string
  time: string
}

export async function createBooking(input: BookingInput) {
  const existingSlot = await prisma.timeSlot.findFirst({
    where: { date: input.date, time: input.time },
  })

  if (existingSlot?.isBooked) throw new SlotAlreadyBookedError()

  const slot = existingSlot ?? await prisma.timeSlot.create({
    data: { date: input.date, time: input.time },
  })

  const { date: _date, time: _time, ...bookingFields } = input

  const booking = await prisma.booking.create({
    data: { ...bookingFields, slotId: slot.id },
  })

  await prisma.timeSlot.update({
    where: { id: slot.id },
    data: { isBooked: true },
  })

  return booking
}
