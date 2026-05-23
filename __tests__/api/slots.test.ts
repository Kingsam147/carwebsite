import { GET } from '@/app/api/slots/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    timeSlot: {
      findMany: jest.fn(),
    },
  },
}))

import prisma from '@/lib/db'

const mockFindMany = prisma.timeSlot.findMany as jest.Mock

describe('GET /api/slots', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns all slots when no date param is provided', async () => {
    const fakeSlots = [
      { id: 1, date: '2026-06-07', time: '9:00 AM', isBooked: false },
      { id: 2, date: '2026-06-07', time: '11:00 AM', isBooked: false },
    ]
    mockFindMany.mockResolvedValue(fakeSlots)

    const request = new NextRequest('http://localhost/api/slots')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(fakeSlots)
  })

  it('returns filtered available slots when date param is provided', async () => {
    const fakeSlots = [{ id: 1, time: '9:00 AM' }]
    mockFindMany.mockResolvedValue(fakeSlots)

    const request = new NextRequest('http://localhost/api/slots?date=2026-06-07')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(fakeSlots)
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { date: '2026-06-07', isBooked: false },
      select: { id: true, time: true },
      orderBy: { time: 'asc' },
    })
  })

  it('returns an empty array when no slots exist', async () => {
    mockFindMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost/api/slots')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual([])
  })
})
