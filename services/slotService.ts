import prisma from '@/lib/db'

export type SlotWithBooking = {
  id: number
  date: string
  time: string
  isBooked: boolean
  booking: {
    name: string
    phone: string
    vehicleType: string
    service: string
    addOns: string
    message: string
  } | null
}

export async function getSlotsByDate(date: string) {
  return prisma.timeSlot.findMany({
    where: { date, isBooked: false },
    select: { id: true, time: true },
    orderBy: { time: 'asc' },
  })
}

export async function getAllSlots(): Promise<SlotWithBooking[]> {
  return prisma.timeSlot.findMany({
    include: { booking: true },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  }) as Promise<SlotWithBooking[]>
}

export async function createSlot(date: string, time: string) {
  return prisma.timeSlot.create({ data: { date, time } })
}

export async function deleteSlot(slotId: number) {
  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } })
  if (!slot) return null
  if (slot.isBooked) {
    await prisma.booking.delete({ where: { slotId } })
  }
  return prisma.timeSlot.delete({ where: { id: slotId } })
}
