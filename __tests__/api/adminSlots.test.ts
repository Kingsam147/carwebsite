import { GET, POST } from '@/app/api/admin/slots/route'
import { DELETE } from '@/app/api/admin/slots/[id]/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    timeSlot: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    booking: {
      delete: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  isAdminAuthenticated: jest.fn(),
}))

import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

const mockAuth = isAdminAuthenticated as jest.Mock
const mockFindMany = prisma.timeSlot.findMany as jest.Mock
const mockFindUnique = prisma.timeSlot.findUnique as jest.Mock
const mockCreate = prisma.timeSlot.create as jest.Mock
const mockDelete = prisma.timeSlot.delete as jest.Mock

function makeRequest(body?: unknown) {
  return new NextRequest('http://localhost/api/admin/slots', {
    method: body ? 'POST' : 'GET',
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('Admin Slots API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuth.mockResolvedValue(true)
  })

  describe('GET /api/admin/slots', () => {
    it('returns slots with booking data when authenticated', async () => {
      const fakeSlots = [{ id: 1, date: '2026-06-07', time: '9:00 AM', isBooked: false, booking: null }]
      mockFindMany.mockResolvedValue(fakeSlots)

      const response = await GET()
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual(fakeSlots)
    })

    it('returns 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue(false)
      const response = await GET()
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/admin/slots', () => {
    it('creates a new slot', async () => {
      const fakeSlot = { id: 5, date: '2026-07-01', time: '10:00 AM', isBooked: false }
      mockCreate.mockResolvedValue(fakeSlot)

      const response = await POST(makeRequest({ date: '2026-07-01', time: '10:00 AM' }))
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body).toEqual(fakeSlot)
    })

    it('returns 400 when date or time is missing', async () => {
      const response = await POST(makeRequest({ date: '2026-07-01' }))
      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/admin/slots/:id', () => {
    it('deletes an unbooked slot', async () => {
      mockFindUnique.mockResolvedValue({ id: 1, isBooked: false })
      mockDelete.mockResolvedValue({})

      const req = new NextRequest('http://localhost/api/admin/slots/1', { method: 'DELETE' })
      const response = await DELETE(req, { params: Promise.resolve({ id: '1' }) })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual({ success: true })
    })

    it('returns 404 when slot does not exist', async () => {
      mockFindUnique.mockResolvedValue(null)

      const req = new NextRequest('http://localhost/api/admin/slots/99', { method: 'DELETE' })
      const response = await DELETE(req, { params: Promise.resolve({ id: '99' }) })
      expect(response.status).toBe(404)
    })
  })
})
