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

// Business hours: 8:00 AM – 5:00 PM in 30-minute increments
const START_HOUR = 8
const END_HOUR = 17
const INCREMENT_MINUTES = 30

function generateDaySlots(): string[] {
  const slots: string[] = []
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const minutes = hour === END_HOUR ? [0] : [0, 30]
    for (const minute of minutes) {
      const period = hour < 12 ? 'AM' : 'PM'
      const display = hour > 12 ? hour - 12 : hour
      slots.push(`${display}:${minute.toString().padStart(2, '0')} ${period}`)
    }
  }
  return slots
}

export async function getSlotsByDate(date: string) {
  const bookedSlots = await prisma.timeSlot.findMany({
    where: { date, isBooked: true },
    select: { time: true },
  })
  const bookedTimes = new Set(bookedSlots.map((s) => s.time))

  const today = new Date().toISOString().split('T')[0]
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()

  return generateDaySlots()
    .filter((time) => {
      if (bookedTimes.has(time)) return false
      if (date === today) {
        const [rawTime, period] = time.split(' ')
        const [h, m] = rawTime.split(':').map(Number)
        let slotHour = period === 'PM' && h !== 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h
        const slotMinutes = slotHour * 60 + m
        return slotMinutes > nowMinutes + 60
      }
      return true
    })
    .map((time) => ({ time }))
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
