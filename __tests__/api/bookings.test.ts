import { POST } from '@/app/api/bookings/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    timeSlot: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
    },
  },
}))

import prisma from '@/lib/db'

const mockFindUnique = prisma.timeSlot.findUnique as jest.Mock
const mockUpdate = prisma.timeSlot.update as jest.Mock
const mockCreate = prisma.booking.create as jest.Mock

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a booking and marks slot as booked', async () => {
    const fakeSlot = { id: 1, date: '2026-06-07', time: '9:00 AM', isBooked: false }
    const fakeBooking = { id: 1, name: 'John', phone: '555-1234', vehicleType: 'Sedan', service: 'Full Detail', addOns: '', message: '', slotId: 1 }

    mockFindUnique.mockResolvedValue(fakeSlot)
    mockCreate.mockResolvedValue(fakeBooking)
    mockUpdate.mockResolvedValue({ ...fakeSlot, isBooked: true })

    const response = await POST(makeRequest({ name: 'John', phone: '555-1234', vehicleType: 'Sedan', service: 'Full Detail', slotId: 1 }))
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body).toEqual(fakeBooking)
    expect(mockUpdate).toHaveBeenCalledWith({ where: { id: 1 }, data: { isBooked: true } })
  })

  it('returns 400 when required fields are missing', async () => {
    const response = await POST(makeRequest({ name: 'John' }))
    expect(response.status).toBe(400)
  })

  it('returns 404 when slot does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)
    const response = await POST(makeRequest({ name: 'John', phone: '555-1234', vehicleType: 'Sedan', service: 'Full Detail', slotId: 99 }))
    expect(response.status).toBe(404)
  })

  it('returns 409 when slot is already booked', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, date: '2026-06-07', time: '9:00 AM', isBooked: true })
    const response = await POST(makeRequest({ name: 'John', phone: '555-1234', vehicleType: 'Sedan', service: 'Full Detail', slotId: 1 }))
    expect(response.status).toBe(409)
  })
})
